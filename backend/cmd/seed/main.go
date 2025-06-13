package main

import (
	"errors"
	"fmt"
	"log"
	"math"
	"math/rand"
	"strings"
	"time"

	"github.com/V-enekoder/HiringGroup/config"
	"github.com/V-enekoder/HiringGroup/src/schema"
	"github.com/go-faker/faker/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	// 1. Cargar configuración y conectar a la base de datos
	log.Println("Iniciando programa de seeding...")
	config.LoadEnv()
	config.ConnectDB()
	config.SyncDB()

	runSeeder("Roles", SeedRoles)
	runSeeder("Zonas", SeedZones)
	runSeeder("Profesiones", SeedProfessions)                     //Cesar
	runSeeder("Períodos de Contratación", SeedContractingPeriods) //Cesar
	runSeeder("Bancos", SeedBanks)                                //Cesar
	runSeeder("Admins", SeedAdmins)
	runSeeder("Candidatos", SeedCandidates)
	runSeeder("EmpleadosHG", SeedEmployeesHG)
	runSeeder("Compañías", SeedCompanies)
	runSeeder("Contactos de Emergencia", SeedEmergencyContacts)
	runSeeder("Currículums", SeedCurriculums)
	runSeeder("Experiencias Laborales", SeedLaboralExperiences)
	runSeeder("Ofertas de Trabajo", SeedJobOffers)
	runSeeder("Postulaciones", SeedPostulations)
	runSeeder("Contratos", SeedContracts)
	runSeeder("Pagos", SeedPayments)

	log.Println("Programa de seeding finalizado exitosamente.")
}

func runSeeder(seederName string, seederFunc func(db *gorm.DB) error) {
	if err := seederFunc(config.DB); err != nil {
		log.Fatalf("Error durante el seeding de '%s': %v", seederName, err)
	}
}

func SeedRoles(db *gorm.DB) error {
	roles := []schema.Role{
		{Name: "Admin"},
		{Name: "EmployeeHG"},
		{Name: "Company"},
		{Name: "Candidate"},
	}

	for _, role := range roles {
		result := db.FirstOrCreate(&role, schema.Role{Name: role.Name})
		if result.Error != nil {
			return result.Error
		}
	}
	log.Println("Seeding de Roles completado.")
	return nil
}

func SeedZones(db *gorm.DB) error {
	venezuelanStates := []string{
		"Amazonas",
		"Anzoátegui",
		"Apure",
		"Aragua",
		"Barinas",
		"Bolívar",
		"Carabobo",
		"Cojedes",
		"Delta Amacuro",
		"Distrito Capital",
		"Falcón",
		"Guárico",
		"Lara",
		"Mérida",
		"Miranda",
		"Monagas",
		"Nueva Esparta",
		"Portuguesa",
		"Sucre",
		"Táchira",
		"Trujillo",
		"Vargas",
		"Yaracuy",
		"Zulia",
		"Dependencias Federales",
	}

	for _, stateName := range venezuelanStates {
		zone := schema.Zone{Name: stateName}
		result := db.FirstOrCreate(&zone, schema.Zone{Name: zone.Name})

		if result.Error != nil {
			return result.Error
		}
	}

	log.Println("Seeding de Zonas (Estados de Venezuela) completado.")
	return nil
}

func SeedProfessions(db *gorm.DB) error {
	professionsList := []string{
		"Ingeniero de Software",
		"Desarrollador Frontend",
		"Desarrollador Backend",
		"Ingeniero de Datos",
		"Científico de Datos",
		"Ingeniero DevOps",
		"Especialista en Ciberseguridad",
		"Diseñador UX/UI",
		"Diseñador Gráfico",
		"Gerente de Proyectos",
		"Analista de Negocios",
		"Especialista en Marketing Digital",
		"Contador Público",
		"Abogado",
		"Gerente de Recursos Humanos",
		"Administrador de Sistemas",
		"Soporte Técnico",
		"Enfermero/a",
		"Médico General",
		"Arquitecto",
	}

	for _, profName := range professionsList {
		profession := schema.Profession{Name: profName}
		result := db.FirstOrCreate(&profession, schema.Profession{Name: profession.Name})

		if result.Error != nil {
			return result.Error
		}
	}

	log.Println("Seeding de Profesiones completado.")
	return nil
}

func SeedContractingPeriods(db *gorm.DB) error {
	periodsList := []string{
		"1 mes",
		"3 meses",
		"6 meses",
		"12 meses",
		"Indefinido",
	}

	for _, periodName := range periodsList {
		period := schema.ContractingPeriod{Name: periodName}
		result := db.FirstOrCreate(&period, schema.ContractingPeriod{Name: period.Name})

		if result.Error != nil {
			return result.Error
		}
	}

	log.Println("Seeding de Períodos de Contratación completado.")
	return nil
}

func SeedBanks(db *gorm.DB) error {
	banksList := []string{
		"Banco de Venezuela",
		"Banesco",
		"Banco Provincial",
		"Banco Mercantil",
		"Banco Nacional de Crédito (BNC)",
		"Bancaribe",
		"Banco del Tesoro",
		"Banco Bicentenario",
		"Banplus",
		"100% Banco",
		"Bancamiga",
		"Mi Banco",
		"Banco Plaza",
	}

	for _, bankName := range banksList {
		bank := schema.Bank{Name: bankName}
		result := db.FirstOrCreate(&bank, schema.Bank{Name: bank.Name})

		if result.Error != nil {
			return result.Error
		}
	}

	log.Println("Seeding de Bancos completado.")
	return nil
}

func SeedAdmins(db *gorm.DB) error {
	var adminRole schema.Role
	if err := db.First(&adminRole, "name = ?", "Admin").Error; err != nil {
		return err
	}

	hashedPassword, err := hashPassword("12345")
	if err != nil {
		return err
	}

	return db.Transaction(func(tx *gorm.DB) error {
		user := schema.User{
			Name:     "Admin",
			Email:    "admin@example.com",
			Password: hashedPassword,
			RoleID:   adminRole.ID,
		}

		result := tx.FirstOrCreate(&user, schema.User{Email: user.Email})
		if result.Error != nil {
			return result.Error
		}

		if result.RowsAffected == 0 {
			log.Println("Usuario Admin ya existe, omitiendo.")
			return nil
		}

		admin := schema.Admin{UserID: user.ID}
		if err := tx.Create(&admin).Error; err != nil {
			return err
		}

		log.Printf("Usuario 'Admin' (%s) creado.", user.Email)
		return nil
	})
}

func hashPassword(password string) (string, error) {
	if password == "" {
		return "", fmt.Errorf("la contraseña no puede estar vacía")
	}

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("falló la generación del hash bcrypt: %w", err)
	}
	return string(hashedBytes), nil
}

func SeedCandidates(db *gorm.DB) error {
	// --- 1. Preparación de Datos Manuales ---
	// En lugar de faker, usamos slices de datos predefinidos para tener control.
	firstNames := []string{"Ana", "Carlos", "Beatriz", "David", "Elena", "Fernando", "Gabriela", "Hugo", "Isabel", "Javier"}
	lastNames := []string{"García", "Rodríguez", "Martínez", "Hernández", "López", "González", "Pérez", "Sánchez", "Ramírez", "Torres"}
	bloodTypes := []string{"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"}
	addresses := []string{
		"Calle Falsa 123, Ciudad Gótica",
		"Avenida Siempreviva 742, Springfield",
		"Plaza Mayor 1, Madrid",
		"Carrera 7 # 12-45, Bogotá",
		"Rua Augusta 200, São Paulo",
		"Paseo de la Reforma 222, CDMX",
		"Calle del Sol 45, Lima",
		"Avenida 9 de Julio, Buenos Aires",
		"Gran Vía 50, Bilbao",
		"Calle Larios 10, Málaga",
	}

	// --- 2. Lógica del Seeder (similar a la original) ---
	count := 10
	var candidateRole schema.Role
	if err := db.First(&candidateRole, "name = ?", "Candidate").Error; err != nil {
		return fmt.Errorf("rol 'Candidate' no encontrado: %w", err)
	}

	hashedPassword, err := hashPassword("12345")
	if err != nil {
		return err
	}

	log.Printf("Creando %d usuarios de tipo Candidato (sin faker)...", count)
	for i := 0; i < count; i++ {
		err := db.Transaction(func(tx *gorm.DB) error {
			firstName := firstNames[i%len(firstNames)]
			lastName := lastNames[i%len(lastNames)]
			// Creamos un email único y predecible.
			email := fmt.Sprintf("%s.%s%d@example.com", strings.ToLower(firstName), strings.ToLower(lastName), i)

			user := schema.User{
				Name:     firstName,
				Email:    email,
				Password: hashedPassword,
				RoleID:   candidateRole.ID,
			}
			if err := tx.Create(&user).Error; err != nil {
				return fmt.Errorf("error al crear el usuario base: %w", err)
			}

			// --- 4. Generación de datos del Candidato ---
			// Generamos datos con formato específico usando fmt.Sprintf y time.
			candidate := schema.Candidate{
				UserID:      user.ID,
				LastName:    lastName,
				Document:    fmt.Sprintf("%03d-%07d-%01d", i+1, rand.Intn(9000000)+1000000, i%10), // Documento único
				BloodType:   bloodTypes[i%len(bloodTypes)],
				Address:     addresses[i%len(addresses)],
				BankAccount: fmt.Sprintf("5555%012d", rand.Int63n(1e12)), // Número de cuenta de 16 dígitos
				PhoneNumber: fmt.Sprintf("809-555-%04d", i+1000),         // Teléfono con formato
				DateOfBirth: time.Now().AddDate(-20-i, -i, -i),           // Fechas de nacimiento distintas
				Hired:       false,                                       // Por defecto es false
			}

			if err := tx.Create(&candidate).Error; err != nil {
				return fmt.Errorf("error al crear el perfil del candidato: %w", err)
			}

			log.Printf("Candidato '%s %s' (Email: %s) creado.", user.Name, candidate.LastName, user.Email)
			return nil
		})

		if err != nil {
			return fmt.Errorf("error creando candidato #%d: %w", i+1, err)
		}
	}
	log.Printf("Seeder de Candidatos finalizado exitosamente. Se crearon %d registros.", count)
	return nil
}

func SeedEmployeesHG(db *gorm.DB) error {
	employeeData := []struct {
		Name  string
		Email string
	}{
		{Name: "Olivia Pérez", Email: "olivia.perez@human-growth.com"},
		{Name: "Mateo Castillo", Email: "mateo.castillo@human-growth.com"},
	}
	count := len(employeeData)

	// --- 2. Lógica del Seeder ---
	var employeeRole schema.Role
	if err := db.First(&employeeRole, "name = ?", "EmployeeHG").Error; err != nil {
		return fmt.Errorf("rol 'EmployeeHG' no encontrado: %w", err)
	}

	hashedPassword, err := hashPassword("12345")
	if err != nil {
		return err
	}

	log.Printf("Creando %d usuarios de tipo EmployeeHG (sin faker)...", count)
	for i := 0; i < count; i++ {
		// Obtenemos los datos del empleado actual del slice
		data := employeeData[i]

		err := db.Transaction(func(tx *gorm.DB) error {
			// Crear el registro base en 'users' usando los datos predefinidos
			user := schema.User{
				Name:     data.Name,
				Email:    data.Email,
				Password: hashedPassword,
				RoleID:   employeeRole.ID,
			}
			if err := tx.Create(&user).Error; err != nil {

				return fmt.Errorf("error al crear el usuario base para '%s': %w", data.Email, err)
			}
			employee := schema.EmployeeHG{UserID: user.ID}
			if err := tx.Create(&employee).Error; err != nil {
				return fmt.Errorf("error al crear el perfil de EmployeeHG para '%s': %w", data.Email, err)
			}

			log.Printf("Empleado HG '%s' (Email: %s) creado.", user.Name, user.Email)
			return nil
		})

		if err != nil {
			return fmt.Errorf("error creando empleado HG #%d (%s): %w", i+1, data.Email, err)
		}
	}
	log.Printf("Seeder de EmployeeHG finalizado exitosamente. Se crearon %d registros.", count)
	return nil
}

func SeedCompanies(db *gorm.DB) error {

	companyData := []struct {
		CompanyName    string
		CompanySector  string
		CompanyAddress string
		ContactName    string
		ContactEmail   string
	}{
		{
			CompanyName:    "Innovatech Solutions",
			CompanySector:  "Tecnología y Software",
			CompanyAddress: "Parque Tecnológico, Edificio Alfa, Oficina 101",
			ContactName:    "Laura Gómez",
			ContactEmail:   "contacto@innovatech.com",
		},
		{
			CompanyName:    "Finanzas Globales S.A.",
			CompanySector:  "Servicios Financieros",
			CompanyAddress: "Avenida Capital 2020, Piso 15",
			ContactName:    "Marcos Díaz",
			ContactEmail:   "rh@finanzasglobales.com",
		},
		{
			CompanyName:    "Salud Integral Corp",
			CompanySector:  "Salud y Bienestar",
			CompanyAddress: "Calle de la Sanidad 75, Consultorio 3",
			ContactName:    "Sofia Reyes",
			ContactEmail:   "talento@saludintegral.net",
		},
	}
	count := len(companyData)

	// --- 2. Lógica del Seeder ---
	var companyRole schema.Role
	if err := db.First(&companyRole, "name = ?", "Company").Error; err != nil {
		return fmt.Errorf("rol 'Company' no encontrado: %w", err)
	}

	hashedPassword, err := hashPassword("12345")
	if err != nil {
		return err
	}

	log.Printf("Creando %d usuarios de tipo Compañía (sin faker)...", count)
	for i := 0; i < count; i++ {
		data := companyData[i]

		err := db.Transaction(func(tx *gorm.DB) error {
			// Crear el registro base en 'users' con los datos del contacto
			user := schema.User{
				RoleID:   companyRole.ID,
				Password: hashedPassword,
				Name:     data.ContactName,
				Email:    data.ContactEmail,
			}
			if err := tx.Create(&user).Error; err != nil {
				return fmt.Errorf("error al crear el usuario para la compañía '%s': %w", data.CompanyName, err)
			}

			// Crear el registro específico en 'companies' con los datos de la empresa
			company := schema.Company{
				UserID:  user.ID,
				Name:    data.CompanyName,
				Sector:  data.CompanySector,
				Address: data.CompanyAddress,
			}
			if err := tx.Create(&company).Error; err != nil {
				return fmt.Errorf("error al crear el perfil de la compañía '%s': %w", data.CompanyName, err)
			}

			log.Printf("Compañía '%s' (Email de contacto: %s) creada.", company.Name, user.Email)
			return nil
		})
		if err != nil {
			return fmt.Errorf("error creando compañía #%d (%s): %w", i+1, data.CompanyName, err)
		}
	}
	log.Printf("Seeder de Compañías finalizado exitosamente. Se crearon %d registros.", count)
	return nil
}

func SeedEmergencyContacts(db *gorm.DB) error {
	// --- Paso 1: Crear los contactos de emergencia con datos predefinidos ---

	// En lugar de faker, usamos un slice de datos predefinidos.
	contactData := []struct {
		Name     string
		LastName string
	}{
		{Name: "Miguel", LastName: "Cervantes"},
		{Name: "Luisa", LastName: "Roldán"},
		{Name: "Pedro", LastName: "Almodóvar"},
		{Name: "Ana", LastName: "Torroja"},
		{Name: "Javier", LastName: "Bardem"},
		{Name: "Penélope", LastName: "Cruz"},
		{Name: "Antonio", LastName: "Banderas"},
		{Name: "Rosalía", LastName: "Vila"},
		{Name: "Rafael", LastName: "Nadal"},
		{Name: "Isabel", LastName: "Coixet"},
	}
	//totalContactsToCreate := len(contactData)
	var emergencyContacts []schema.EmergencyContact

	log.Println("Iniciando seeding de Contactos de Emergencia (sin faker)...")

	// Iteramos sobre nuestra lista de datos predefinidos
	for i, data := range contactData {
		contact := schema.EmergencyContact{
			Name:     data.Name,
			LastName: data.LastName,
			// Generamos un número de teléfono con formato, pero predecible/único
			PhoneNumber: fmt.Sprintf("809-777-%04d", i+2000),
		}

		if err := db.Create(&contact).Error; err != nil {
			return fmt.Errorf("no se pudo crear el contacto de emergencia '%s %s': %w", data.Name, data.LastName, err)
		}
		emergencyContacts = append(emergencyContacts, contact)
	}

	if len(emergencyContacts) == 0 {
		log.Println("No se crearon contactos de emergencia, el proceso de vinculación se detiene.")
		return errors.New("no se crearon contactos de emergencia durante el proceso de seeding")
	}
	log.Printf("Se crearon %d contactos de emergencia.", len(emergencyContacts))

	// --- Paso 2: Vincular los contactos a los candidatos (ESTA LÓGICA NO CAMBIA) ---

	var candidatesToUpdate []schema.Candidate
	// Buscamos candidatos que aún no tengan un contacto de emergencia asignado.
	if err := db.Where("emergency_contact_id IS NULL").Find(&candidatesToUpdate).Error; err != nil {
		return fmt.Errorf("error al buscar candidatos sin contacto de emergencia: %w", err)
	}

	if len(candidatesToUpdate) == 0 {
		log.Println("Todos los candidatos ya tienen un contacto de emergencia. No se necesita hacer nada.")
		return nil
	}

	log.Printf("Vinculando contactos de emergencia a %d candidatos...", len(candidatesToUpdate))

	// Usamos un índice aleatorio para que no siempre se asignen en el mismo orden
	rand.Seed(time.Now().UnixNano())

	for _, candidate := range candidatesToUpdate {
		// Seleccionamos un contacto al azar de los que acabamos de crear
		contactToAssign := emergencyContacts[rand.Intn(len(emergencyContacts))]

		// Actualizamos solo el campo EmergencyContactID del candidato
		result := db.Model(&candidate).Update("EmergencyContactID", contactToAssign.ID)

		if result.Error != nil {
			return fmt.Errorf("error al actualizar el candidato con ID %d para vincular el contacto de emergencia: %w", candidate.ID, result.Error)
		}
	}

	log.Println("Seeding y vinculación de Contactos de Emergencia completado.")
	return nil
}

func SeedCurriculums(db *gorm.DB) error {
	var professions []schema.Profession
	if err := db.Find(&professions).Error; err != nil {
		log.Fatalf("Error al obtener las profesiones: %v", err)
		return err
	}
	if len(professions) == 0 {
		return errors.New("no professions found")
	}

	var candidatesWithoutCurriculum []schema.Candidate
	err := db.Joins("LEFT JOIN curriculums ON curriculums.candidate_id = candidates.id").
		Where("curriculums.id IS NULL").
		Find(&candidatesWithoutCurriculum).Error

	if err != nil {
		return err
	}

	if len(candidatesWithoutCurriculum) == 0 {
		return errors.New("no candidates without curriculum found")
	}

	log.Printf("Creando currículums para %d candidatos...", len(candidatesWithoutCurriculum))

	for _, candidate := range candidatesWithoutCurriculum {
		randomProfession := professions[rand.Intn(len(professions))]

		skills := []string{
			"Resolución de Problemas",
			"Trabajo en Equipo",
			"Comunicación Efectiva",
		}
		languages := []string{"Español (Nativo)", "Inglés (Intermedio)"}

		curriculum := schema.Curriculum{
			CandidateID:  candidate.ID,
			ProfessionID: randomProfession.ID,
			Resume: "Profesional dedicado y proactivo con experiencia en " +
				randomProfession.Name +
				". Buscando nuevas oportunidades para" +
				"aplicar mis habilidades y crecer profesionalmente.",
			UniversityOfGraduation: faker.Name() + " University",
			Skills:                 strings.Join(skills, ", "),
			SpokenLanguages:        strings.Join(languages, ", "),
		}

		if err := db.Create(&curriculum).Error; err != nil {
			log.Printf("Error al crear el currículum para el candidato ID %d: %v", candidate.ID, err)
		}
	}

	log.Println("Seeding de Currículums completado.")
	return nil
}

func SeedLaboralExperiences(db *gorm.DB) error {

	companyNames := []string{
		"Innovatech Solutions", "Quantum Dynamics", "Alpha Health",
		"NextGen Logistics", "Stellar Financials", "Eco-Builders Inc.",
		"Creative Minds Agency", "Data-Driven Insights", "Vertex Gaming",
		"Global Secure Systems", "Pioneer Robotics", "Synergy Marketing",
	}

	var curriculumsWithoutExp []schema.Curriculum
	err := db.Preload("Profession").
		Joins("LEFT JOIN laboral_experiences ON laboral_experiences.curriculum_id = curriculums.id").
		Where("laboral_experiences.id IS NULL").
		Find(&curriculumsWithoutExp).Error

	if err != nil {
		return fmt.Errorf("error al buscar currículums sin experiencia: %w", err)
	}

	if len(curriculumsWithoutExp) == 0 {
		log.Println("Todos los currículums ya tienen al menos una experiencia laboral. No se necesita hacer nada.")
		return nil // Es un estado válido, no un error.
	}

	log.Printf("Creando experiencias laborales para %d currículums (sin faker)...", len(curriculumsWithoutExp))

	// --- Paso 2: Iterar y crear experiencias (LÓGICA REFACTORIZADA) ---
	for _, curriculum := range curriculumsWithoutExp {
		numExperiences := rand.Intn(3) + 1 // Crear entre 1 y 3 experiencias
		lastEndDate := time.Now()          // La experiencia más reciente termina "hoy"

		for i := 0; i < numExperiences; i++ {

			jobDurationMonths := rand.Intn(36) + 6 // Duración del trabajo: entre 6 y 41 meses
			startDate := lastEndDate.AddDate(0, -jobDurationMonths, 0)

			jobTitle := curriculum.Profession.Name
			randValue := rand.Float32()
			if randValue < 0.3 {
				jobTitle = "Senior " + jobTitle
			} else if randValue < 0.6 {
				jobTitle = "Junior " + jobTitle
			}

			companyName := companyNames[rand.Intn(len(companyNames))]

			// Creamos el registro directamente con todos los datos calculados.
			experience := schema.LaboralExperience{
				CurriculumID: curriculum.ID,
				Company:      companyName, // Usamos el nombre de nuestra lista
				JobTitle:     jobTitle,
				Description:  "Responsable de tareas clave relacionadas con " + curriculum.Profession.Name + ". Logré mejorar la eficiencia del equipo en un 15%.",
				Start:        startDate,
				End:          lastEndDate,
			}

			if err := db.Create(&experience).Error; err != nil {
				log.Printf("Error al crear la experiencia laboral para el currículum ID %d: %v", curriculum.ID, err)
				continue // Continuar con el siguiente intento en lugar de detener todo el seeder
			}

			// Preparamos la fecha de fin para la siguiente experiencia (la anterior en el tiempo).
			gapMonths := rand.Intn(6) + 1 // Espacio de tiempo entre trabajos
			lastEndDate = startDate.AddDate(0, -gapMonths, 0)
		}
	}

	log.Println("Seeding de Experiencias Laborales completado.")
	return nil
}

func SeedJobOffers(db *gorm.DB) error {
	// --- Paso 1: Obtener IDs necesarios (LÓGICA ORIGINAL INTACTA) ---
	var companies []schema.Company
	if err := db.Select("id").Find(&companies).Error; err != nil || len(companies) == 0 {
		return fmt.Errorf("no se pudieron cargar las compañías o la tabla está vacía. Ejecute primero el seeder de compañías")
	}

	var professions []schema.Profession
	if err := db.Select("id", "name").Find(&professions).Error; err != nil || len(professions) == 0 {
		return fmt.Errorf("no se pudieron cargar las profesiones o la tabla está vacía. Ejecute primero el seeder de profesiones")
	}

	var zones []schema.Zone
	if err := db.Select("id").Find(&zones).Error; err != nil || len(zones) == 0 {
		return fmt.Errorf("no se pudieron cargar las zonas o la tabla está vacía. Ejecute primero el seeder de zonas")
	}

	// --- Paso 2: Preparar plantillas para la generación de datos ---
	descriptionTemplates := []string{
		"Buscamos un/a %s apasionado/a y con experiencia para unirse a nuestro dinámico equipo. Serás responsable de liderar proyectos clave y colaborar con múltiples departamentos.",
		"Excelente oportunidad para un/a %s proactivo/a. El candidato ideal deberá tener fuertes habilidades analíticas y capacidad para resolver problemas complejos. Ofrecemos un entorno de trabajo innovador.",
		"Empresa líder en su sector está en búsqueda de un/a %s para contribuir a nuestro crecimiento. Ofrecemos un salario competitivo, beneficios superiores y oportunidades de desarrollo profesional.",
		"¿Eres un/a %s con ganas de hacer la diferencia? ¡Te estamos buscando! Únete a nosotros para trabajar en proyectos desafiantes y de alto impacto.",
	}

	totalOffersToCreate := 50
	log.Printf("Iniciando seeding de %d Ofertas de Trabajo (sin faker)...", totalOffersToCreate)

	// Inicializar la semilla para el generador de números aleatorios
	rand.Seed(time.Now().UnixNano())

	// --- Paso 3: Crear las ofertas de trabajo en un bucle ---
	for i := 0; i < totalOffersToCreate; i++ {
		// La llamada a faker.FakeData() ha sido eliminada.

		// La selección aleatoria de entidades se mantiene igual.
		randomCompany := companies[rand.Intn(len(companies))]
		randomProfession := professions[rand.Intn(len(professions))]
		randomZone := zones[rand.Intn(len(zones))]

		// --- Generación manual de los datos restantes ---

		// a) Generar un título de puesto coherente (lógica original)
		jobTitle := randomProfession.Name
		randValue := rand.Float32()
		if randValue < 0.25 {
			jobTitle = "Senior " + jobTitle
		} else if randValue > 0.85 {
			jobTitle = "Junior " + jobTitle
		}

		// b) Generar una descripción a partir de una plantilla
		descTemplate := descriptionTemplates[rand.Intn(len(descriptionTemplates))]
		description := fmt.Sprintf(descTemplate, randomProfession.Name)

		// c) Generar un salario en un rango realista y redondearlo a 2 decimales
		salary := 35000 + rand.Float64()*(120000-35000) // Salario entre 35k y 120k
		salary = math.Round(salary*100) / 100

		// d) Definir si la oferta está activa (la mayoría lo estarán)
		isActive := rand.Float32() < 0.90 // 90% de las ofertas estarán activas

		// --- Construir el objeto y crearlo en la DB ---
		jobOffer := schema.JobOffer{
			CompanyID:    randomCompany.ID,
			ProfessionID: randomProfession.ID,
			ZoneID:       randomZone.ID,
			Active:       isActive,
			Description:  description,
			OpenPosition: jobTitle,
			Salary:       salary,
		}

		if err := db.Create(&jobOffer).Error; err != nil {
			log.Printf("Error al crear la oferta de trabajo #%d: %v", i+1, err)
		}
	}

	log.Println("Seeding de Ofertas de Trabajo completado.")
	return nil
}

func SeedPostulations(db *gorm.DB) error {
	// --- Paso 1: Cargar los IDs de las tablas dependientes (LÓGICA ORIGINAL INTACTA) ---
	var candidates []schema.Candidate
	if err := db.Select("id").Find(&candidates).Error; err != nil || len(candidates) == 0 {
		return fmt.Errorf("no se pudieron cargar los candidatos o la tabla está vacía. Ejecute primero el seeder de candidatos")
	}

	var jobOffers []schema.JobOffer
	if err := db.Select("id").Find(&jobOffers).Error; err != nil || len(jobOffers) == 0 {
		return fmt.Errorf("no se pudieron cargar las ofertas de trabajo o la tabla está vacía. Ejecute primero el seeder de ofertas")
	}

	// --- Paso 2: Preparar la lógica para evitar duplicados (LÓGICA ORIGINAL INTACTA) ---
	type postulationKey struct {
		CandidateID uint
		JobID       uint
	}
	// Este mapa es crucial para asegurar que un candidato no se postule a la misma oferta dos veces.
	existingPostulations := make(map[postulationKey]bool)

	log.Printf("Iniciando seeding de Postulaciones para %d candidatos (sin faker)...", len(candidates))

	// Inicializar la semilla para el generador de números aleatorios
	rand.Seed(time.Now().UnixNano())

	// --- Paso 3: Iterar sobre cada candidato para crear sus postulaciones ---
	for _, candidate := range candidates {
		// Cada candidato se postulará a un número aleatorio de ofertas (entre 1 y 5)
		numApplications := rand.Intn(5) + 1

		applicationsCreated := 0
		maxAttempts := numApplications * 10 // Previene bucles infinitos

		for applicationsCreated < numApplications && maxAttempts > 0 {
			maxAttempts--
			// Seleccionar una oferta de trabajo al azar
			randomJobOffer := jobOffers[rand.Intn(len(jobOffers))]
			key := postulationKey{CandidateID: candidate.ID, JobID: randomJobOffer.ID}

			// Verificar si el candidato ya se postuló a esta oferta
			if _, exists := existingPostulations[key]; exists {
				continue // Si ya existe, intentar con otra oferta
			}

			isActive := rand.Float32() < 0.95

			postulation := schema.Postulation{
				CandidateID: candidate.ID,
				JobID:       randomJobOffer.ID,
				Active:      isActive,
			}

			if err := db.Create(&postulation).Error; err != nil {
				log.Printf("Error al crear la postulación para el candidato ID %d y oferta ID %d: %v", candidate.ID, randomJobOffer.ID, err)
				continue
			}

			// Registrar la postulación creada en nuestro mapa y contarla
			existingPostulations[key] = true
			applicationsCreated++
		}
	}

	log.Println("Seeding de Postulaciones completado.")
	return nil
}

func SeedContracts(db *gorm.DB) error {
	// --- Paso 1: Cargar IDs y postulaciones disponibles (LÓGICA ORIGINAL INTACTA) ---

	var periods []schema.ContractingPeriod
	if err := db.Select("id").Find(&periods).Error; err != nil || len(periods) == 0 {
		return fmt.Errorf("no se pudieron cargar los períodos de contratación o la tabla está vacía")
	}

	var availablePostulations []schema.Postulation
	// Esta consulta es clave: busca postulaciones activas que NO tienen un contrato asociado.
	err := db.Joins("LEFT JOIN contracts ON contracts.postulation_id = postulations.id").
		Where("postulations.active = ? AND contracts.id IS NULL", true).
		Find(&availablePostulations).Error

	if err != nil {
		return fmt.Errorf("error al buscar postulaciones disponibles: %w", err)
	}

	if len(availablePostulations) == 0 {
		log.Println("No hay postulaciones activas disponibles para crear contratos. Proceso finalizado.")
		return nil // Es un estado válido, no un error.
	}

	log.Printf("Evaluando %d postulaciones para crear contratos (sin faker)...", len(availablePostulations))

	// --- Paso 2: Preparar la lógica para evitar contrataciones duplicadas (LÓGICA ORIGINAL INTACTA) ---
	hiredCandidates := make(map[uint]bool) // Para no contratar al mismo candidato dos veces.
	filledJobs := make(map[uint]bool)      // Para no llenar la misma oferta de trabajo dos veces.

	rand.Seed(time.Now().UnixNano())

	contractsCreated := 0
	for _, postulation := range availablePostulations {

		// Regla 1: Si el candidato ya fue contratado, pasar al siguiente.
		if hiredCandidates[postulation.CandidateID] {
			continue
		}

		// Regla 2: Si la oferta ya fue cubierta, pasar a la siguiente.
		if filledJobs[postulation.JobID] {
			continue
		}

		// Regla 3: Simular una tasa de éxito de contratación del 20%.
		if rand.Float32() > 0.20 {
			continue
		}

		// --- Paso 3: Ejecutar la contratación dentro de una transacción ---
		// Esto asegura que todas las actualizaciones se realicen o ninguna.
		err := db.Transaction(func(tx *gorm.DB) error {
			// 1. Crear el contrato (SIN FAKER)
			contract := schema.Contract{
				PostulationID: postulation.ID,
				PeriodID:      periods[rand.Intn(len(periods))].ID,
				Active:        true, // Un nuevo contrato se considera activo por defecto.
			}
			if err := tx.Create(&contract).Error; err != nil {
				return fmt.Errorf("error al crear el contrato: %w", err)
			}

			// 2. Actualizar al candidato a 'contratado'
			if err := tx.Model(&schema.Candidate{}).Where("id = ?", postulation.CandidateID).Update("hired", true).Error; err != nil {
				return fmt.Errorf("error al actualizar el estado del candidato: %w", err)
			}

			// 3. Desactivar la oferta de trabajo
			if err := tx.Model(&schema.JobOffer{}).Where("id = ?", postulation.JobID).Update("active", false).Error; err != nil {
				return fmt.Errorf("error al desactivar la oferta de trabajo: %w", err)
			}

			// 4. Desactivar las demás postulaciones activas del candidato
			if err := tx.Model(&schema.Postulation{}).Where("candidate_id = ? AND id != ?", postulation.CandidateID, postulation.ID).Update("active", false).Error; err != nil {
				return fmt.Errorf("error al desactivar otras postulaciones del candidato: %w", err)
			}

			return nil // Si no hay errores, la transacción se compromete (commit).
		})

		if err != nil {
			log.Printf("Fallo en la transacción para la postulación ID %d: %v. Revirtiendo cambios (rollback).", postulation.ID, err)
			continue // Continuar con la siguiente postulación.
		}

		// Si la transacción fue exitosa, registrar la contratación.
		hiredCandidates[postulation.CandidateID] = true
		filledJobs[postulation.JobID] = true
		contractsCreated++
		log.Printf("¡Contrato creado! Candidato ID %d contratado para la oferta ID %d.", postulation.CandidateID, postulation.JobID)
	}

	log.Printf("Seeding de Contratos completado. Se crearon %d contratos.", contractsCreated)
	return nil
}

const (
	hiringGroupFeeRate    = 0.02  // 2%
	incesFeeRate          = 0.005 // 0.5%
	socialSecurityFeeRate = 0.01  // 1% para IVSS
)

// SeedPayments crea un pago mensual para cada contrato activo.
func SeedPayments(db *gorm.DB) error {
	var activeContracts []schema.Contract
	err := db.Preload("Postulation.JobOffer").
		Where("active = ?", true).
		Find(&activeContracts).Error

	if err != nil {
		log.Fatalf("Error al buscar contratos activos: %v", err)
		return err
	}

	if len(activeContracts) == 0 {
		log.Println("No hay contratos activos para generar pagos.")
		return errors.New("no active contracts found")
	}

	log.Printf("Iniciando seeding de Pagos para %d contratos activos...", len(activeContracts))

	// --- Paso 2: Iterar sobre cada contrato activo para generar un pago ---
	for _, contract := range activeContracts {
		if contract.Postulation.ID == 0 || contract.Postulation.JobOffer.ID == 0 {
			log.Printf("Saltando contrato ID %d: no se pudieron cargar los datos de postulación u oferta de trabajo.", contract.ID)
			continue
		}
		grossSalary := contract.Postulation.JobOffer.Salary
		if grossSalary <= 0 {
			log.Printf("Saltando contrato ID %d: el salario en la oferta de trabajo es cero o negativo.", contract.ID)
			continue
		}

		// Calcular las tarifas y deducciones
		hiringGroupFee := grossSalary * hiringGroupFeeRate
		incesFee := grossSalary * incesFeeRate
		socialSecurityFee := grossSalary * socialSecurityFeeRate

		// Calcular el pago neto para el trabajador
		netAmount := grossSalary - hiringGroupFee - incesFee - socialSecurityFee

		// Crear el registro de pago
		payment := schema.Payment{
			ContractID:        contract.ID,
			Date:              time.Now(), // Asumimos que el pago es para el mes actual
			Amount:            grossSalary,
			HiringGroupFee:    hiringGroupFee,
			INCESFee:          incesFee,
			SocialSecurityFee: socialSecurityFee,
			NetAmount:         netAmount,
		}

		// Guardar el pago en la base de datos
		if err := db.Create(&payment).Error; err != nil {
			log.Printf("Error al crear el pago para el contrato ID %d: %v", contract.ID, err)
		}
	}

	log.Println("Seeding de Pagos completado.")
	return nil
}
