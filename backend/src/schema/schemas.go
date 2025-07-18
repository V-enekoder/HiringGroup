package schema

import (
	"time"
)

// Role representa la tabla "roles"
type Role struct {
	ID   uint `gorm:"primaryKey"`
	Name string
	// Relaciones
	Users []User `gorm:"foreignKey:RoleID"`
}

type Zone struct {
	ID   uint `gorm:"primaryKey"`
	Name string
	// Relaciones
	JobOffers []JobOffer `gorm:"foreignKey:ZoneID"`
}

type Profession struct {
	ID   uint `gorm:"primaryKey"`
	Name string
	// Relaciones
	Curriculums []Curriculum `gorm:"foreignKey:ProfessionID"`
	JobOffers   []JobOffer   `gorm:"foreignKey:ProfessionID"`
}

type ContractingPeriod struct {
	ID   uint `gorm:"primaryKey"`
	Name string
	// Relaciones
	Contracts []Contract `gorm:"foreignKey:PeriodID"`
}

func (ContractingPeriod) TableName() string {
	return "contracting_period"
}

type Bank struct {
	ID   uint `gorm:"primaryKey"`
	Name string
	// Relaciones

	Candidates []*Candidate `gorm:"foreignKey:BankID"`
}

type User struct { //Actualizar email y contraseña en un solo endpoint
	ID       uint `gorm:"primaryKey"`
	RoleID   uint
	Name     string `gorm:"size:255;not null"`
	Email    string `gorm:"size:100;uniqueIndex;not null"`
	Password string
	// Relaciones
	Role       Role        `gorm:"foreignKey:RoleID"`
	Admin      *Admin      `gorm:"foreignKey:UserID"`
	EmployeeHG *EmployeeHG `gorm:"foreignKey:UserID"`
	Company    *Company    `gorm:"foreignKey:UserID"`
	Candidate  *Candidate  `gorm:"foreignKey:UserID"`
}

type EmployeeHG struct {
	ID     uint `gorm:"primaryKey"`
	UserID uint // Clave foránea
	// Relaciones
	User User `gorm:"foreignKey:UserID"`
}

func (EmployeeHG) TableName() string {
	return "employeesHG"
}

type Admin struct {
	ID     uint `gorm:"primaryKey"`
	UserID uint // Clave foránea
	// Relaciones
	User User `gorm:"foreignKey:UserID"`
}
type Company struct {
	ID      uint `gorm:"primaryKey"`
	UserID  uint
	Name    string
	Sector  string
	Address string
	// Relaciones
	User      User       `gorm:"foreignKey:UserID"`
	JobOffers []JobOffer `gorm:"foreignKey:CompanyID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

// Candidate representa la tabla "candidates"
type Candidate struct {
	ID          uint  `gorm:"primaryKey"`
	BankID      *uint // Nullable, se quedará en nil
	UserID      uint
	LastName    string `gorm:"size:255;not null"`
	Document    string // Genera un número como de documento
	BloodType   string
	Address     string
	PhoneNumber string
	DateOfBirth time.Time
	Hired       bool
	BankAccount string
	// Relaciones
	User             User              `gorm:"foreignKey:UserID"`
	Curriculum       *Curriculum       `gorm:"foreignKey:CandidateID"`
	Postulations     []Postulation     `gorm:"foreignKey:CandidateID"`
	Bank             *Bank             `gorm:"foreignKey:BankID"`
	EmergencyContact *EmergencyContact `gorm:"foreignKey:CandidateID"`
}

// LaboralExperience representa la tabla "laboral_experiences"
type LaboralExperience struct {
	ID           uint `gorm:"primaryKey"`
	CurriculumID uint // Clave foránea
	Company      string
	JobTitle     string
	Description  string    `gorm:"type:text"`
	StartDate    time.Time `gorm:"type:date"`
	EndDate      time.Time `gorm:"type:date"`
	// Relaciones
	Curriculum Curriculum `gorm:"foreignKey:CurriculumID"`
}

func (LaboralExperience) TableName() string {
	return "laboral_experiences"
}

type EmergencyContact struct {
	ID          uint `gorm:"primaryKey"`
	CandidateID uint // Clave foránea
	Name        string
	LastName    string
	PhoneNumber string
	// Relaciones
	Candidate Candidate `gorm:"foreignKey:CandidateID"`
}

func (EmergencyContact) TableName() string {
	return "emergency_contacts"
}

// Curriculum representa la tabla "curriculum"
type Curriculum struct {
	ID                     uint `gorm:"primaryKey"`
	CandidateID            uint // Clave foránea
	ProfessionID           uint // Clave foránea
	Resume                 string
	UniversityOfGraduation string
	Skills                 string  `gorm:"type:text"`
	SpokenLanguages        string  `gorm:"type:text"`
	PhotoURL               *string `gorm:"column:photo_url;size:255"`
	// Relaciones
	Candidate          Candidate           `gorm:"foreignKey:CandidateID"`
	Profession         Profession          `gorm:"foreignKey:ProfessionID"`
	LaboralExperiences []LaboralExperience `gorm:"foreignKey:CurriculumID"`
}

type JobOffer struct {
	ID           uint `gorm:"primaryKey"`
	CompanyID    uint // Se asigna manualmente
	ProfessionID uint // Se asigna manualmente
	ZoneID       uint // Se asigna manualmente
	Active       bool
	Description  string `gorm:"type:text"`
	OpenPosition string
	Salary       float64
	// Relaciones
	Company      Company       `gorm:"foreignKey:CompanyID"`
	Profession   Profession    `gorm:"foreignKey:ProfessionID"`
	Zone         Zone          `gorm:"foreignKey:ZoneID"`
	Postulations []Postulation `gorm:"foreignKey:JobID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func (JobOffer) TableName() string {
	return "job_offers"
}

// Postulation representa la tabla "postulations"
type Postulation struct {
	ID          uint `gorm:"primaryKey"`
	CandidateID uint // Se asigna manualmente
	JobID       uint // Se asigna manualmente (referencia a job_offers.id)
	Active      bool
	// Relaciones
	Candidate Candidate `gorm:"foreignKey:CandidateID"`
	JobOffer  JobOffer  `gorm:"foreignKey:JobID"`
	Contract  *Contract `gorm:"foreignKey:PostulationID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Contract representa la tabla "contracts"
type Contract struct {
	ID            uint `gorm:"primaryKey"`
	PostulationID uint `gorm:"uniqueIndex"`
	PeriodID      uint // Clave foránea
	Active        bool
	// Relaciones
	Postulation       Postulation       `gorm:"foreignKey:PostulationID"`
	ContractingPeriod ContractingPeriod `gorm:"foreignKey:PeriodID"`
	Payments          []Payment         `gorm:"foreignKey:ContractID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Payment representa la tabla "payments"
type Payment struct {
	ID                uint      `gorm:"primaryKey"`
	ContractID        uint      // Clave foránea
	Date              time.Time `gorm:"type:date"`
	Amount            float64   `gorm:"type:decimal(10,2)" faker:"amount"` // Genera un monto de pago
	HiringGroupFee    float64   `gorm:"type:decimal(10,2)"`
	INCESFee          float64   `gorm:"type:decimal(10,2)"`
	SocialSecurityFee float64   `gorm:"type:decimal(10,2)"`
	NetAmount         float64   `gorm:"type:decimal(10,2)"`
	// Relaciones
	Contract Contract `gorm:"foreignKey:ContractID"`
}
