#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class CarroAmareloAPITester:
    def __init__(self, base_url="https://carro-amarelo.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_ids = {
            'carros': [],
            'clientes': [],
            'funcionarios': [],
            'vendas': []
        }

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=True):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_login(self):
        """Test login functionality"""
        print("\n🔐 Testing Authentication...")
        
        # Test valid login
        success, response = self.run_test(
            "Login with valid credentials",
            "POST",
            "auth/login",
            200,
            data={"email": "joao@carroamarelo.com", "senha": "senha123"},
            auth_required=False
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:20]}...")
            
            # Test /auth/me endpoint
            self.run_test(
                "Get current user info",
                "GET", 
                "auth/me",
                200
            )
        else:
            print("❌ Failed to get authentication token")
            return False

        # Test invalid login
        self.run_test(
            "Login with invalid credentials",
            "POST",
            "auth/login", 
            401,
            data={"email": "invalid@email.com", "senha": "wrongpass"},
            auth_required=False
        )
        
        return True

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        print("\n📊 Testing Dashboard...")
        
        success, stats = self.run_test(
            "Get dashboard statistics",
            "GET",
            "dashboard/stats",
            200
        )
        
        if success:
            expected_fields = ['total_carros', 'carros_disponiveis', 'carros_vendidos', 
                             'total_vendas', 'total_clientes', 'total_funcionarios']
            
            missing_fields = [field for field in expected_fields if field not in stats]
            if missing_fields:
                self.log_test("Dashboard stats structure", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Dashboard stats structure", True)
                print(f"   📈 Stats: {stats['total_carros']} carros, {stats['total_clientes']} clientes, {stats['total_funcionarios']} funcionários")

    def test_carros_crud(self):
        """Test cars CRUD operations"""
        print("\n🚗 Testing Cars CRUD...")
        
        # Get all cars
        success, carros = self.run_test("Get all cars", "GET", "carros", 200)
        if success:
            print(f"   Found {len(carros)} cars in database")
        
        # Create new car
        new_car_data = {
            "modelo": "SUV",
            "marca": "Toyota", 
            "cor": "Branco",
            "preco": 85000.00,
            "portas": 4
        }
        
        success, created_car = self.run_test(
            "Create new car",
            "POST",
            "carros",
            200,
            data=new_car_data
        )
        
        if success and 'id' in created_car:
            car_id = created_car['id']
            self.created_ids['carros'].append(car_id)
            
            # Update car
            update_data = {"preco": 90000.00, "cor": "Preto"}
            self.run_test(
                "Update car",
                "PUT",
                f"carros/{car_id}",
                200,
                data=update_data
            )
            
            # Get all cars to verify update
            success, all_cars = self.run_test(
                "Get all cars to verify update",
                "GET",
                "carros",
                200
            )
            
            if success:
                updated_car = next((c for c in all_cars if c['id'] == car_id), None)
                if updated_car and updated_car.get('preco') == 90000.00:
                    self.log_test("Car update verification", True)
                else:
                    self.log_test("Car update verification", False, "Price not updated correctly")
            else:
                self.log_test("Car update verification", False, "Could not fetch cars to verify update")

    def test_clientes_crud(self):
        """Test clients CRUD operations"""
        print("\n👥 Testing Clients CRUD...")
        
        # Get all clients
        success, clientes = self.run_test("Get all clients", "GET", "clientes", 200)
        if success:
            print(f"   Found {len(clientes)} clients in database")
        
        # Create new client
        new_client_data = {
            "nome": "Test Client",
            "cpf": "123.456.789-00",
            "telefone": "(11) 99999-9999",
            "email": "test@client.com",
            "endereco": "Test Address, 123"
        }
        
        success, created_client = self.run_test(
            "Create new client",
            "POST",
            "clientes",
            200,
            data=new_client_data
        )
        
        if success and 'id' in created_client:
            client_id = created_client['id']
            self.created_ids['clientes'].append(client_id)
            
            # Update client
            update_data = {"telefone": "(11) 88888-8888"}
            self.run_test(
                "Update client",
                "PUT",
                f"clientes/{client_id}",
                200,
                data=update_data
            )

    def test_funcionarios_crud(self):
        """Test employees CRUD operations"""
        print("\n👨‍💼 Testing Employees CRUD...")
        
        # Get all employees
        success, funcionarios = self.run_test("Get all employees", "GET", "funcionarios", 200)
        if success:
            print(f"   Found {len(funcionarios)} employees in database")
        
        # Create new employee with unique email
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        new_employee_data = {
            "nome": "Test Employee",
            "cargo": "Vendedor",
            "email": f"test{timestamp}@employee.com",
            "salario": 3000.00,
            "senha": "testpass123"
        }
        
        success, created_employee = self.run_test(
            "Create new employee",
            "POST",
            "funcionarios",
            200,
            data=new_employee_data
        )
        
        if success and 'id' in created_employee:
            employee_id = created_employee['id']
            self.created_ids['funcionarios'].append(employee_id)
            
            # Update employee (without password)
            update_data = {"salario": 3500.00}
            self.run_test(
                "Update employee salary",
                "PUT",
                f"funcionarios/{employee_id}",
                200,
                data=update_data
            )

    def test_vendas_crud(self):
        """Test sales CRUD operations"""
        print("\n💰 Testing Sales CRUD...")
        
        # Get all sales
        success, vendas = self.run_test("Get all sales", "GET", "vendas", 200)
        if success:
            print(f"   Found {len(vendas)} sales in database")
        
        # Get available cars for sale
        success, carros = self.run_test("Get cars for sale test", "GET", "carros", 200)
        available_cars = [c for c in carros if c['status'] == 'disponível'] if success else []
        
        # Get clients and employees for sale
        success_c, clientes = self.run_test("Get clients for sale test", "GET", "clientes", 200)
        success_f, funcionarios = self.run_test("Get employees for sale test", "GET", "funcionarios", 200)
        
        if available_cars and success_c and success_f and clientes and funcionarios:
            # Create new sale
            new_sale_data = {
                "carro_id": available_cars[0]['id'],
                "cliente_id": clientes[0]['id'],
                "funcionario_id": funcionarios[0]['id'],
                "valor_venda": available_cars[0]['preco']
            }
            
            success, created_sale = self.run_test(
                "Create new sale",
                "POST",
                "vendas",
                200,
                data=new_sale_data
            )
            
            if success and 'id' in created_sale:
                sale_id = created_sale['id']
                self.created_ids['vendas'].append(sale_id)
                
                # Verify car status changed to 'vendido'
                success, all_cars_after_sale = self.run_test(
                    "Get cars to verify sale status",
                    "GET",
                    "carros",
                    200
                )
                
                if success:
                    sold_car = next((c for c in all_cars_after_sale if c['id'] == available_cars[0]['id']), None)
                    if sold_car and sold_car.get('status') == 'vendido':
                        self.log_test("Car status update after sale", True)
                    else:
                        self.log_test("Car status update after sale", False, "Car status not updated to 'vendido'")
                else:
                    self.log_test("Car status update after sale", False, "Could not fetch cars to verify status")
                
                # Test selling already sold car (should fail)
                self.run_test(
                    "Attempt to sell already sold car",
                    "POST",
                    "vendas",
                    400,
                    data=new_sale_data
                )
                
                # Delete sale and verify car status reverts
                success, _ = self.run_test(
                    "Delete sale",
                    "DELETE",
                    f"vendas/{sale_id}",
                    200
                )
                
                if success:
                    # Verify car status reverted to 'disponível'
                    success, all_cars_after_delete = self.run_test(
                        "Get cars to verify status revert",
                        "GET",
                        "carros",
                        200
                    )
                    
                    if success:
                        reverted_car = next((c for c in all_cars_after_delete if c['id'] == available_cars[0]['id']), None)
                        if reverted_car and reverted_car.get('status') == 'disponível':
                            self.log_test("Car status revert after sale deletion", True)
                        else:
                            self.log_test("Car status revert after sale deletion", False, "Car status not reverted to 'disponível'")
                    else:
                        self.log_test("Car status revert after sale deletion", False, "Could not fetch cars to verify status revert")
        else:
            self.log_test("Sales test setup", False, "No available cars, clients, or employees for testing")

    def cleanup_test_data(self):
        """Clean up created test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete in reverse order due to dependencies
        for sale_id in self.created_ids['vendas']:
            self.run_test(f"Cleanup sale {sale_id}", "DELETE", f"vendas/{sale_id}", 200)
            
        for car_id in self.created_ids['carros']:
            self.run_test(f"Cleanup car {car_id}", "DELETE", f"carros/{car_id}", 200)
            
        for client_id in self.created_ids['clientes']:
            self.run_test(f"Cleanup client {client_id}", "DELETE", f"clientes/{client_id}", 200)
            
        for employee_id in self.created_ids['funcionarios']:
            self.run_test(f"Cleanup employee {employee_id}", "DELETE", f"funcionarios/{employee_id}", 200)

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Carro Amarelo API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        
        # Authentication tests
        if not self.test_login():
            print("❌ Authentication failed - stopping tests")
            return False
        
        # Core functionality tests
        self.test_dashboard_stats()
        self.test_carros_crud()
        self.test_clientes_crud() 
        self.test_funcionarios_crud()
        self.test_vendas_crud()
        
        # Cleanup
        self.cleanup_test_data()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"   Tests run: {self.tests_run}")
        print(f"   Tests passed: {self.tests_passed}")
        print(f"   Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = CarroAmareloAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": f"{(tester.tests_passed/tester.tests_run*100):.1f}%",
        "test_details": tester.test_results
    }
    
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())