import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from passlib.context import CryptContext
import uuid
from datetime import datetime, timezone, timedelta
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_database():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🌱 Iniciando seed do banco de dados...")
    
    # Clear existing data
    await db.funcionarios.delete_many({})
    await db.clientes.delete_many({})
    await db.carros.delete_many({})
    await db.vendas.delete_many({})
    
    # Funcionários
    funcionarios = [
        {"id": str(uuid.uuid4()), "nome": "João Silva", "cargo": "Gerente de Vendas", "email": "joao@carroamarelo.com", "salario": 5500.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Maria Santos", "cargo": "Vendedora", "email": "maria@carroamarelo.com", "salario": 3200.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Pedro Oliveira", "cargo": "Vendedor", "email": "pedro@carroamarelo.com", "salario": 3000.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Ana Costa", "cargo": "Consultora", "email": "ana@carroamarelo.com", "salario": 3500.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Carlos Mendes", "cargo": "Vendedor", "email": "carlos@carroamarelo.com", "salario": 3100.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Juliana Rocha", "cargo": "Vendedora", "email": "juliana@carroamarelo.com", "salario": 3300.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Roberto Lima", "cargo": "Supervisor", "email": "roberto@carroamarelo.com", "salario": 4200.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Fernanda Alves", "cargo": "Vendedora", "email": "fernanda@carroamarelo.com", "salario": 3000.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Lucas Ferreira", "cargo": "Vendedor", "email": "lucas@carroamarelo.com", "salario": 2900.0, "senha": pwd_context.hash("senha123")},
        {"id": str(uuid.uuid4()), "nome": "Patricia Souza", "cargo": "Consultora Senior", "email": "patricia@carroamarelo.com", "salario": 4000.0, "senha": pwd_context.hash("senha123")},
    ]
    await db.funcionarios.insert_many(funcionarios)
    print(f"✅ {len(funcionarios)} funcionários criados")
    
    # Clientes
    clientes = [
        {"id": str(uuid.uuid4()), "nome": "Ricardo Barbosa", "cpf": "123.456.789-01", "telefone": "(11) 98765-4321", "email": "ricardo@email.com", "endereco": "Rua das Flores, 123"},
        {"id": str(uuid.uuid4()), "nome": "Camila Martins", "cpf": "234.567.890-12", "telefone": "(11) 97654-3210", "email": "camila@email.com", "endereco": "Av. Paulista, 456"},
        {"id": str(uuid.uuid4()), "nome": "Bruno Cardoso", "cpf": "345.678.901-23", "telefone": "(11) 96543-2109", "email": "bruno@email.com", "endereco": "Rua Augusta, 789"},
        {"id": str(uuid.uuid4()), "nome": "Tatiana Vieira", "cpf": "456.789.012-34", "telefone": "(11) 95432-1098", "email": "tatiana@email.com", "endereco": "Rua Oscar Freire, 321"},
        {"id": str(uuid.uuid4()), "nome": "Marcos Teixeira", "cpf": "567.890.123-45", "telefone": "(11) 94321-0987", "email": "marcos@email.com", "endereco": "Av. Faria Lima, 654"},
        {"id": str(uuid.uuid4()), "nome": "Beatriz Nunes", "cpf": "678.901.234-56", "telefone": "(11) 93210-9876", "email": "beatriz@email.com", "endereco": "Rua Haddock Lobo, 987"},
        {"id": str(uuid.uuid4()), "nome": "Felipe Araújo", "cpf": "789.012.345-67", "telefone": "(11) 92109-8765", "email": "felipe@email.com", "endereco": "Rua da Consolação, 147"},
        {"id": str(uuid.uuid4()), "nome": "Gabriela Pinto", "cpf": "890.123.456-78", "telefone": "(11) 91098-7654", "email": "gabriela@email.com", "endereco": "Av. Rebouças, 258"},
        {"id": str(uuid.uuid4()), "nome": "Daniel Moreira", "cpf": "901.234.567-89", "telefone": "(11) 90987-6543", "email": "daniel@email.com", "endereco": "Rua dos Pinheiros, 369"},
        {"id": str(uuid.uuid4()), "nome": "Larissa Campos", "cpf": "012.345.678-90", "telefone": "(11) 89876-5432", "email": "larissa@email.com", "endereco": "Rua Bela Cintra, 741"},
        {"id": str(uuid.uuid4()), "nome": "Rafael Gomes", "cpf": "111.222.333-44", "telefone": "(11) 88765-4321", "email": "rafael@email.com", "endereco": "Av. Brasil, 852"},
        {"id": str(uuid.uuid4()), "nome": "Vanessa Lima", "cpf": "222.333.444-55", "telefone": "(11) 87654-3210", "email": "vanessa@email.com", "endereco": "Rua Vergueiro, 963"},
        {"id": str(uuid.uuid4()), "nome": "Thiago Ribeiro", "cpf": "333.444.555-66", "telefone": "(11) 86543-2109", "email": "thiago@email.com", "endereco": "Av. Ibirapuera, 159"},
        {"id": str(uuid.uuid4()), "nome": "Priscila Dias", "cpf": "444.555.666-77", "telefone": "(11) 85432-1098", "email": "priscila@email.com", "endereco": "Rua Jardins, 357"},
        {"id": str(uuid.uuid4()), "nome": "Rodrigo Castro", "cpf": "555.666.777-88", "telefone": "(11) 84321-0987", "email": "rodrigo@email.com", "endereco": "Av. Angélica, 753"},
        {"id": str(uuid.uuid4()), "nome": "Aline Monteiro", "cpf": "666.777.888-99", "telefone": "(11) 83210-9876", "email": "aline@email.com", "endereco": "Rua Estados Unidos, 951"},
        {"id": str(uuid.uuid4()), "nome": "Gustavo Pereira", "cpf": "777.888.999-00", "telefone": "(11) 82109-8765", "email": "gustavo@email.com", "endereco": "Rua Pamplona, 357"},
        {"id": str(uuid.uuid4()), "nome": "Renata Farias", "cpf": "888.999.000-11", "telefone": "(11) 81098-7654", "email": "renata@email.com", "endereco": "Av. Europa, 456"},
        {"id": str(uuid.uuid4()), "nome": "Eduardo Silva", "cpf": "999.000.111-22", "telefone": "(11) 80987-6543", "email": "eduardo@email.com", "endereco": "Rua Harmonia, 789"},
        {"id": str(uuid.uuid4()), "nome": "Isabela Rocha", "cpf": "000.111.222-33", "telefone": "(11) 79876-5432", "email": "isabela@email.com", "endereco": "Av. Sumaré, 852"},
    ]
    await db.clientes.insert_many(clientes)
    print(f"✅ {len(clientes)} clientes criados")
    
    # Carros
    modelos = ["Coupe", "Compacto", "SUV", "Esportivo"]
    marcas = ["Ford", "GMC", "Toyota", "Volkswagen"]
    cores = ["Vermelho", "Preto", "Branco", "Cinza"]
    
    carros_data = [
        {"modelo": "Coupe", "marca": "Ford", "nome": "Mustang"},
        {"modelo": "SUV", "marca": "Ford", "nome": "Explorer"},
        {"modelo": "Compacto", "marca": "Ford", "nome": "Focus"},
        {"modelo": "SUV", "marca": "GMC", "nome": "Terrain"},
        {"modelo": "SUV", "marca": "GMC", "nome": "Acadia"},
        {"modelo": "Compacto", "marca": "Toyota", "nome": "Corolla"},
        {"modelo": "SUV", "marca": "Toyota", "nome": "RAV4"},
        {"modelo": "Esportivo", "marca": "Toyota", "nome": "Supra"},
        {"modelo": "Compacto", "marca": "Volkswagen", "nome": "Golf"},
        {"modelo": "SUV", "marca": "Volkswagen", "nome": "Tiguan"},
    ]
    
    carros = []
    for i, carro_base in enumerate(carros_data):
        for j in range(3):  # 3 carros de cada tipo
            carro = {
                "id": str(uuid.uuid4()),
                "modelo": carro_base["modelo"],
                "marca": carro_base["marca"],
                "cor": random.choice(cores),
                "preco": round(random.uniform(45000, 250000), 2),
                "portas": random.choice([2, 4]),
                "status": "disponível"
            }
            carros.append(carro)
    
    await db.carros.insert_many(carros)
    print(f"✅ {len(carros)} carros criados")
    
    # Vendas (15 vendas)
    vendas = []
    carros_disponiveis = carros[:15]  # Pegar os primeiros 15 carros
    
    for i in range(15):
        carro = carros_disponiveis[i]
        data_venda = datetime.now(timezone.utc) - timedelta(days=random.randint(1, 90))
        
        venda = {
            "id": str(uuid.uuid4()),
            "carro_id": carro["id"],
            "cliente_id": clientes[i]["id"],
            "funcionario_id": random.choice(funcionarios)["id"],
            "data_venda": data_venda.isoformat(),
            "valor_venda": carro["preco"]
        }
        vendas.append(venda)
        
        # Marcar carro como vendido
        await db.carros.update_one({"id": carro["id"]}, {"$set": {"status": "vendido"}})
    
    await db.vendas.insert_many(vendas)
    print(f"✅ {len(vendas)} vendas criadas")
    
    print("\n🎉 Seed concluído com sucesso!")
    print("\n📧 Credenciais de login:")
    print("Email: joao@carroamarelo.com")
    print("Senha: senha123")
    print("\n(Todos os funcionários usam a senha: senha123)")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
