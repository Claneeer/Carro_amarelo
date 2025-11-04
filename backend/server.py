from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('SECRET_KEY', 'carro-amarelo-secret-key-2025')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Pydantic Models
class Funcionario(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    cargo: str
    email: EmailStr
    salario: float

class FuncionarioCreate(BaseModel):
    nome: str
    cargo: str
    email: EmailStr
    salario: float
    senha: str

class FuncionarioUpdate(BaseModel):
    nome: Optional[str] = None
    cargo: Optional[str] = None
    email: Optional[EmailStr] = None
    salario: Optional[float] = None
    senha: Optional[str] = None

class Cliente(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    cpf: str
    telefone: str
    email: EmailStr
    endereco: str

class ClienteCreate(BaseModel):
    nome: str
    cpf: str
    telefone: str
    email: EmailStr
    endereco: str

class ClienteUpdate(BaseModel):
    nome: Optional[str] = None
    cpf: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[EmailStr] = None
    endereco: Optional[str] = None

class Carro(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    modelo: str  # Coupe, Compacto, SUV, Esportivo
    marca: str  # Ford, GMC, Toyota, Volkswagen
    cor: str  # Vermelho, Preto, Branco, Cinza
    preco: float
    portas: int
    status: str = "disponível"  # disponível, vendido

class CarroCreate(BaseModel):
    modelo: str
    marca: str
    cor: str
    preco: float
    portas: int

class CarroUpdate(BaseModel):
    modelo: Optional[str] = None
    marca: Optional[str] = None
    cor: Optional[str] = None
    preco: Optional[float] = None
    portas: Optional[int] = None
    status: Optional[str] = None

class Venda(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    carro_id: str
    cliente_id: str
    funcionario_id: str
    data_venda: str
    valor_venda: float

class VendaCreate(BaseModel):
    carro_id: str
    cliente_id: str
    funcionario_id: str
    valor_venda: float

class LoginRequest(BaseModel):
    email: EmailStr
    senha: str

class LoginResponse(BaseModel):
    token: str
    funcionario: Funcionario

class DashboardStats(BaseModel):
    total_carros: int
    carros_disponiveis: int
    carros_vendidos: int
    total_vendas: float
    total_clientes: int
    total_funcionarios: int
    vendas_por_modelo: dict
    vendas_por_marca: dict

# Auth functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        funcionario = await db.funcionarios.find_one({"email": email}, {"_id": 0, "senha": 0})
        if funcionario is None:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        return funcionario
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except Exception:
        raise HTTPException(status_code=401, detail="Não autorizado")

# Auth endpoints
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    funcionario = await db.funcionarios.find_one({"email": login_data.email})
    if not funcionario or not verify_password(login_data.senha, funcionario["senha"]):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    access_token = create_access_token(data={"sub": funcionario["email"]})
    
    # Remove sensitive data
    funcionario.pop("senha")
    funcionario.pop("_id")
    
    return {"token": access_token, "funcionario": funcionario}

@api_router.get("/auth/me", response_model=Funcionario)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Funcionários endpoints
@api_router.get("/funcionarios", response_model=List[Funcionario])
async def get_funcionarios(current_user: dict = Depends(get_current_user)):
    funcionarios = await db.funcionarios.find({}, {"_id": 0, "senha": 0}).to_list(1000)
    return funcionarios

@api_router.post("/funcionarios", response_model=Funcionario)
async def create_funcionario(funcionario: FuncionarioCreate, current_user: dict = Depends(get_current_user)):
    # Check if email already exists
    existing = await db.funcionarios.find_one({"email": funcionario.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    func_dict = funcionario.model_dump()
    senha = func_dict.pop("senha")
    func_dict["senha"] = hash_password(senha)
    func_obj = Funcionario(**{k: v for k, v in func_dict.items() if k != "senha"})
    
    doc = func_obj.model_dump()
    doc["senha"] = func_dict["senha"]
    await db.funcionarios.insert_one(doc)
    return func_obj

@api_router.put("/funcionarios/{funcionario_id}", response_model=Funcionario)
async def update_funcionario(funcionario_id: str, funcionario: FuncionarioUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in funcionario.model_dump().items() if v is not None}
    
    if "senha" in update_data:
        update_data["senha"] = hash_password(update_data["senha"])
    
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
    
    result = await db.funcionarios.update_one({"id": funcionario_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    
    updated = await db.funcionarios.find_one({"id": funcionario_id}, {"_id": 0, "senha": 0})
    return updated

@api_router.delete("/funcionarios/{funcionario_id}")
async def delete_funcionario(funcionario_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.funcionarios.delete_one({"id": funcionario_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    return {"message": "Funcionário excluído com sucesso"}

# Clientes endpoints
@api_router.get("/clientes", response_model=List[Cliente])
async def get_clientes(current_user: dict = Depends(get_current_user)):
    clientes = await db.clientes.find({}, {"_id": 0}).to_list(1000)
    return clientes

@api_router.post("/clientes", response_model=Cliente)
async def create_cliente(cliente: ClienteCreate, current_user: dict = Depends(get_current_user)):
    cliente_obj = Cliente(**cliente.model_dump())
    doc = cliente_obj.model_dump()
    await db.clientes.insert_one(doc)
    return cliente_obj

@api_router.put("/clientes/{cliente_id}", response_model=Cliente)
async def update_cliente(cliente_id: str, cliente: ClienteUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in cliente.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
    
    result = await db.clientes.update_one({"id": cliente_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    updated = await db.clientes.find_one({"id": cliente_id}, {"_id": 0})
    return updated

@api_router.delete("/clientes/{cliente_id}")
async def delete_cliente(cliente_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.clientes.delete_one({"id": cliente_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return {"message": "Cliente excluído com sucesso"}

# Carros endpoints
@api_router.get("/carros", response_model=List[Carro])
async def get_carros(current_user: dict = Depends(get_current_user)):
    carros = await db.carros.find({}, {"_id": 0}).to_list(1000)
    return carros

@api_router.post("/carros", response_model=Carro)
async def create_carro(carro: CarroCreate, current_user: dict = Depends(get_current_user)):
    carro_obj = Carro(**carro.model_dump())
    doc = carro_obj.model_dump()
    await db.carros.insert_one(doc)
    return carro_obj

@api_router.put("/carros/{carro_id}", response_model=Carro)
async def update_carro(carro_id: str, carro: CarroUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in carro.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
    
    result = await db.carros.update_one({"id": carro_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Carro não encontrado")
    
    updated = await db.carros.find_one({"id": carro_id}, {"_id": 0})
    return updated

@api_router.delete("/carros/{carro_id}")
async def delete_carro(carro_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.carros.delete_one({"id": carro_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Carro não encontrado")
    return {"message": "Carro excluído com sucesso"}

# Vendas endpoints
@api_router.get("/vendas", response_model=List[Venda])
async def get_vendas(current_user: dict = Depends(get_current_user)):
    vendas = await db.vendas.find({}, {"_id": 0}).to_list(1000)
    return vendas

@api_router.post("/vendas", response_model=Venda)
async def create_venda(venda: VendaCreate, current_user: dict = Depends(get_current_user)):
    # Verify carro exists and is available
    carro = await db.carros.find_one({"id": venda.carro_id})
    if not carro:
        raise HTTPException(status_code=404, detail="Carro não encontrado")
    if carro["status"] == "vendido":
        raise HTTPException(status_code=400, detail="Carro já foi vendido")
    
    # Verify cliente exists
    cliente = await db.clientes.find_one({"id": venda.cliente_id})
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    # Verify funcionario exists
    funcionario = await db.funcionarios.find_one({"id": venda.funcionario_id})
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    
    # Create venda
    venda_dict = venda.model_dump()
    venda_dict["data_venda"] = datetime.now(timezone.utc).isoformat()
    venda_obj = Venda(**venda_dict)
    
    doc = venda_obj.model_dump()
    await db.vendas.insert_one(doc)
    
    # Update carro status
    await db.carros.update_one({"id": venda.carro_id}, {"$set": {"status": "vendido"}})
    
    return venda_obj

@api_router.delete("/vendas/{venda_id}")
async def delete_venda(venda_id: str, current_user: dict = Depends(get_current_user)):
    # Get venda to revert carro status
    venda = await db.vendas.find_one({"id": venda_id})
    if not venda:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    
    # Revert carro status
    await db.carros.update_one({"id": venda["carro_id"]}, {"$set": {"status": "disponível"}})
    
    # Delete venda
    await db.vendas.delete_one({"id": venda_id})
    return {"message": "Venda excluída com sucesso"}

# Dashboard endpoint
@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    carros = await db.carros.find({}, {"_id": 0}).to_list(1000)
    vendas = await db.vendas.find({}, {"_id": 0}).to_list(1000)
    clientes = await db.clientes.find({}, {"_id": 0}).to_list(1000)
    funcionarios = await db.funcionarios.find({}, {"_id": 0}).to_list(1000)
    
    carros_disponiveis = len([c for c in carros if c["status"] == "disponível"])
    carros_vendidos = len([c for c in carros if c["status"] == "vendido"])
    total_vendas = sum([v["valor_venda"] for v in vendas])
    
    # Vendas por modelo
    vendas_por_modelo = {}
    for venda in vendas:
        carro = next((c for c in carros if c["id"] == venda["carro_id"]), None)
        if carro:
            modelo = carro["modelo"]
            vendas_por_modelo[modelo] = vendas_por_modelo.get(modelo, 0) + 1
    
    # Vendas por marca
    vendas_por_marca = {}
    for venda in vendas:
        carro = next((c for c in carros if c["id"] == venda["carro_id"]), None)
        if carro:
            marca = carro["marca"]
            vendas_por_marca[marca] = vendas_por_marca.get(marca, 0) + 1
    
    return {
        "total_carros": len(carros),
        "carros_disponiveis": carros_disponiveis,
        "carros_vendidos": carros_vendidos,
        "total_vendas": total_vendas,
        "total_clientes": len(clientes),
        "total_funcionarios": len(funcionarios),
        "vendas_por_modelo": vendas_por_modelo,
        "vendas_por_marca": vendas_por_marca
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
