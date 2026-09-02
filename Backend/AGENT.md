AGENTS.md — AI Health & Nutrition Management System

1. Purpose

This document defines the mandatory development standards for the AI-Based Personalized Health & Nutrition Management System.

The project is a MERN-based web application for a 2nd Year BCA project.

The backend should follow:

Clean Architecture

SOLID principles

REST API conventions

Dependency Injection

Interface-driven design where useful

DTO-based data mapping

Strong typing when TypeScript is used

Centralized error handling

JWT authentication and authorization

Reusable and maintainable code

Minimal duplication

Clear separation of responsibilities

Do not create unnecessary abstractions just to make the project look complex.

The architecture should solve real problems in this project.

2. IMPORTANT DEVELOPMENT RULE

Before modifying existing code:

Read the related files.

Understand the current flow.

Identify dependencies of the code being changed.

Check whether the same functionality already exists.

Check whether another module depends on the code.

Reuse existing utilities, services, repositories, helpers, and components where appropriate.

Do not duplicate existing functionality.

Do not rewrite working code unnecessarily.

Preserve existing behavior unless the requirement explicitly changes it.

After making a change, verify the complete related flow.

NEVER modify a file blindly.

For example, if changing food scanning:

Route

Authentication middleware

Controller

Request validation

Use Case

Food repository

Food model

AI service interface

AI service implementation

Nutrition lookup

Recommendation logic

Related APIs

Frontend flow

must be considered before making the change.

3. Recommended Technology Stack

Frontend

React.js

React Router

Tailwind CSS

Axios or Fetch

Chart.js or Recharts

Framer Motion only where animation provides value

React Hook Form where useful

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

Email service for OTP/password reset

Multer or equivalent for uploads

PDF generation library

AI

The AI layer must be replaceable.

Possible implementation:

Food recognition model/API

TensorFlow.js or another supported model

External AI provider where appropriate

Nutrition database/API

Do not tightly couple application logic to one AI provider.

4. Architecture

Follow this overall flow:

Request

↓

Route

↓

Middleware

↓

Controller

↓

DTO Mapping / Validation

↓

Use Case

↓

Repository / Service Interfaces

↓

Infrastructure Implementations

↓

Database / External Service

Response:

Database / External Service

↓

Repository

↓

Use Case

↓

Response DTO

↓

Controller

↓

HTTP Response

Business logic MUST NOT be implemented in:

Routes

Controllers

Middleware

Repository implementations

Database models

AI provider adapters

Business workflows belong in the Use Case / application layer.

5. Recommended Backend Folder Structure

Use a structure similar to:

src/
│
├── adapters/
│   ├── controllers/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── user/
│   │   ├── food/
│   │   ├── nutrition/
│   │   ├── meal/
│   │   ├── water/
│   │   ├── report/
│   │   ├── article/
│   │   ├── notification/
│   │   └── ai/
│   │
│   ├── middlewares/
│   │   ├── auth/
│   │   ├── authorization/
│   │   ├── validation/
│   │   ├── upload/
│   │   └── error/
│   │
│   └── repositories/
│       ├── user/
│       ├── healthProfile/
│       ├── food/
│       ├── foodLog/
│       ├── mealPlan/
│       ├── water/
│       ├── report/
│       ├── article/
│       └── notification/
│
├── domain/
│   ├── entities/
│   │   ├── User
│   │   ├── HealthProfile
│   │   ├── Food
│   │   ├── FoodLog
│   │   ├── MealPlan
│   │   ├── WaterIntake
│   │   ├── HealthReport
│   │   ├── Article
│   │   └── Notification
│   │
│   └── interfaces/
│       ├── DTOs/
│       ├── repositories/
│       ├── services/
│       └── useCases/
│
├── framework/
│   ├── DI/
│   ├── database/
│   │   ├── models/
│   │   ├── connection/
│   │   └── seed/
│   ├── routes/
│   └── services/
│       ├── jwt/
│       ├── password/
│       ├── email/
│       ├── ai/
│       ├── storage/
│       └── pdf/
│
├── shared/
│   ├── utils/
│   ├── constants/
│   ├── errors/
│   ├── validators/
│   └── types/
│
├── useCases/
│   ├── auth/
│   ├── admin/
│   ├── user/
│   ├── health/
│   ├── food/
│   ├── nutrition/
│   ├── meal/
│   ├── water/
│   ├── report/
│   ├── article/
│   ├── notification/
│   └── ai/
│
├── app.js
└── server.js

If TypeScript is selected, use .ts files and proper interfaces/types.

Do not create every folder in advance if it has no implementation yet.

6. Controllers

Controllers are responsible ONLY for:

Receiving HTTP requests

Extracting request data

Calling the appropriate Use Case

Mapping request data to DTOs

Mapping Use Case output to responses

Returning correct HTTP status codes

Controllers MUST NOT contain business logic.

Bad:

const createFoodLog = async (req, res) => {
  const food = await Food.findById(req.body.foodId);

  if (food.calories > 500) {
    // recommendation logic
  }

  // business calculations here
};

Good:

const createFoodLog = async (req, res) => {
  const dto = mapRequestToCreateFoodLogDTO(req);

  const result = await createFoodLogUseCase.execute(dto);

  return res.status(201).json({
    success: true,
    message: "Food logged successfully",
    data: result
  });
};

7. Use Cases

All application business workflows MUST be implemented in Use Cases.

Examples:

RegisterUserUseCase

VerifyEmailOTPUseCase

LoginUserUseCase

ResetPasswordUseCase

UpdateHealthProfileUseCase

CalculateBMIUseCase

CreateFoodLogUseCase

ScanFoodUseCase

AnalyzeNutritionUseCase

GenerateRecommendationUseCase

CreateMealPlanUseCase

TrackWaterUseCase

GenerateHealthReportUseCase

BlockUserUseCase

GeneratePDFReportUseCase

A Use Case should represent one meaningful application action.

Use Cases may coordinate multiple repositories and services.

8. Health and BMI Logic

BMI should be calculated using:

BMI = weight in kilograms / height in meters squared

The calculation should happen on the backend when the value is important to business logic.

The frontend may display a live preview, but the backend is the source of truth.

Keep BMI categories simple and clearly defined in one reusable utility/service.

Do not duplicate BMI calculations in multiple controllers.

9. Food Logging

A food log should contain appropriate information such as:

User ID

Food ID or detected food

Serving size

Calories

Protein

Carbohydrates

Fat

Fiber

Sugar

Sodium

Date/time

Food logs should be linked to the authenticated user.

Do not trust a user-provided userId when the authenticated identity is already available from JWT.

Use:

req.user.id

where appropriate.

10. AI Food Scanner

The recommended flow is:

Food Image

↓

Upload Validation

↓

AI Food Recognition

↓

Detected Food

↓

Nutrition Database Lookup

↓

Nutrition Analysis

↓

User Health Profile

↓

Recommendation Engine

↓

Result

The AI service must be isolated behind an interface.

Example:

class ScanFoodUseCase {
  constructor(foodRecognitionService, foodRepository, healthProfileRepository) {
    this.foodRecognitionService = foodRecognitionService;
    this.foodRepository = foodRepository;
    this.healthProfileRepository = healthProfileRepository;
  }
}

The Use Case should not directly call a vendor-specific SDK.

Bad:

// Business logic directly using a provider SDK
providerSdk.detectFood(...)

Good:

ScanFoodUseCase
      ↓
IFoodRecognitionService
      ↓
FoodRecognitionService
      ↓
AI Provider

11. AI Output Validation

AI output must NEVER be trusted blindly.

Validate:

Food name

Confidence score where available

Nutrition lookup result

Expected response structure

Missing values

Invalid values

If the AI is uncertain, show an uncertainty message or ask the user to confirm the food.

AI must not directly modify important database records without application validation.

Example:

Image
 ↓
AI result
 ↓
Validate result
 ↓
Find food in nutrition database
 ↓
User confirmation if needed
 ↓
Save food log

12. Nutrition Analysis

Nutrition values should preferably come from a controlled nutrition database/API after food identification.

Do not claim that the AI can perfectly determine every nutrient from an image.

The application can display:

Calories

Protein

Carbohydrates

Fat

Fiber

Sugar

Sodium

Vitamins

Minerals

Nutrition values should be clearly marked as estimated when appropriate.

Serving size must be considered when calculating totals.

13. Personalized Recommendations

Recommendation flow:

User Profile



Health Information



User Goal



Food Information



Nutrition Values



Allergies

↓

Recommendation Engine

The system may provide:

Weight-loss suggestions

Weight-gain suggestions

Muscle-gain suggestions

Healthier alternatives

Portion guidance

General lifestyle suggestions

General nutrition guidance

Recommendations must not be presented as medical diagnosis or treatment.

For health conditions, use wording such as:

"General nutrition information"

rather than:

"This food will treat your disease."

14. Medical Safety Rules

This is a health-related application.

The application is NOT a medical diagnosis system.

Never claim that the system:

Diagnoses a disease

Cures a disease

Replaces a doctor

Guarantees medical outcomes

Provides medically verified treatment

Recommendations should be framed as general wellness/nutrition information.

Include a suitable disclaimer in the application:

"This application provides general health and nutrition information for educational purposes and is not a substitute for professional medical advice."

Do not create dangerous recommendations based on incomplete user information.

15. Meal Planner

Meal planning should use a controlled meal database.

A meal can contain:

Name

Category

Ingredients

Calories

Protein

Carbohydrates

Fat

Allergens

Suitable goals

Meal type

The system can filter meals using:

User goal

Allergies

Preferences

Nutrition values

AI can assist with suggestions, but final meal data should be validated by application rules.

16. Water Tracker

Water tracking should support:

Daily goal

Add intake

Remove/correct intake

Daily total

History

Progress percentage

Charts

Example:

Daily Goal: 2500 ml
Consumed: 1800 ml
Progress: 72%

Do not duplicate water calculation logic across frontend and backend.

17. Health Reports

Reports may include:

Daily calories

Nutrition summary

Weight

BMI

Water intake

Food history

Weekly trends

Monthly trends

Progress graphs

Report generation should be implemented as a Use Case.

Example:

GenerateHealthReportUseCase
        ↓
User Repository
        ↓
Food Log Repository
        ↓
Water Repository
        ↓
Health Profile Repository
        ↓
Report Builder
        ↓
PDF Service

18. Admin Panel

Admin features:

Admin login

View users

Search/filter users

Block/unblock users

Delete users

View profiles

View health reports

Manage articles

Manage FAQs

Manage food information

View basic application statistics

Admin authorization MUST be enforced on the backend.

Do not rely only on hiding admin pages in React.

19. Authentication

Use:

JWT authentication

bcrypt password hashing

Protected routes

Authentication middleware

Role-based authorization

Authentication answers:

"Who is this user?"

Authorization answers:

"What is this user allowed to do?"

Never trust role values sent by the frontend.

20. Email OTP

OTP flow:

User Registration
      ↓
Generate OTP
      ↓
Store hashed/temporary OTP with expiry
      ↓
Send Email
      ↓
User enters OTP
      ↓
Validate OTP + expiry
      ↓
Verify Account

OTP must expire.

Do not store permanent plain-text OTP values unnecessarily.

The same principle applies to password reset verification.

21. Role-Based Access Control

At minimum:

USER
ADMIN

Example:

USER:

Manage own profile

Log food

Track water

View own reports

Use scanner

View recommendations

ADMIN:

Manage users

View permitted reports

Manage articles

Manage food data

Manage FAQs

Users must never access another user's private health data.

22. Repository Layer

Repositories are responsible for data access only.

Repositories may:

Query MongoDB

Create records

Update records

Delete records where allowed

Apply database-specific operations

Repositories must NOT contain application business rules.

Bad:

Repository decides:
"User has already consumed too many calories, therefore reject."

That belongs in the Use Case.

Use Case decides what the data means.

23. Database Rules

Use Mongoose for MongoDB access.

Do not access Mongoose models directly from controllers.

Preferred flow:

Use Case
   ↓
Repository Interface
   ↓
Repository Implementation
   ↓
Mongoose Model
   ↓
MongoDB

Keep Mongoose-specific details inside the infrastructure/adapter layer.

24. Suggested Database Collections

Recommended collections:

users

healthProfiles

foods

foodLogs

mealPlans

waterIntakes

healthReports

articles

notifications

otpRecords or verification records

Use references for entities that have independent lifecycles.

Avoid storing unnecessary duplicated copies of the same user or food data.

25. DTOs

Never expose database models directly as API responses.

Use DTOs.

Request:

HTTP Request
 ↓
Request DTO
 ↓
Use Case
 ↓
Repository
 ↓
Database

Response:

Database
 ↓
Repository
 ↓
Use Case
 ↓
Response DTO
 ↓
Controller
 ↓
HTTP Response

Never return:

passwordHash

OTP secrets

internal provider details

unnecessary database fields

Do not pass req.body directly into Mongoose.

26. REST API Rules

Use RESTful resource naming.

Examples:

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-otp
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id

GET    /api/health-profile
PATCH  /api/health-profile

POST   /api/food-logs
GET    /api/food-logs
GET    /api/food-logs/:id

POST   /api/food-scans
GET    /api/foods/:id/nutrition

GET    /api/meal-plans
POST   /api/meal-plans

POST   /api/water-intakes
GET    /api/water-intakes

GET    /api/reports/daily
GET    /api/reports/weekly
GET    /api/reports/monthly
GET    /api/reports/:id/pdf

GET    /api/articles
POST   /api/articles
PATCH  /api/articles/:id
DELETE /api/articles/:id

Use:

GET → retrieve

POST → create/action

PATCH → partial update

PUT → complete replacement when required

DELETE → delete

27. HTTP Response Standard

Every API response should contain:

Appropriate HTTP status

Success indicator

Meaningful message

Data when applicable

Success:

{
  "success": true,
  "message": "Food logged successfully",
  "data": {}
}

Error:

{
  "success": false,
  "message": "Food could not be found",
  "error": {
    "code": "FOOD_NOT_FOUND"
  }
}

Use correct status codes:

200 → successful request

201 → resource created

204 → successful request with no body

400 → invalid request

401 → authentication required/invalid token

403 → authenticated but not authorized

404 → resource not found

409 → business conflict

422 → semantic validation failure

500 → unexpected server error

Do not return 200 for failed operations.

28. Centralized Error Handling

Do not repeat response handling in every controller.

Create reusable errors such as:

BadRequestError

UnauthorizedError

ForbiddenError

NotFoundError

ConflictError

ValidationError

Use centralized error middleware.

Do not expose:

Stack traces

Database errors

API keys

Internal service details

to users.

29. Validation

Validate:

Request body

Params

Query parameters

Uploaded files

OTP

Health values

Food IDs

AI output

Frontend validation is NOT enough.

The backend must validate all important input.

Examples:

Height must be positive

Weight must be positive

Age must be within a sensible project-defined range

Email must be valid

Uploaded images must have allowed file types and size limits

Food IDs must be valid

OTP must have expiry validation

30. File Upload Security

For profile pictures and food images:

Validate MIME type

Validate file extension

Limit file size

Generate safe filenames/keys

Do not trust the original filename

Store files in a controlled storage location

Avoid exposing private files publicly unless intended

Do not allow arbitrary file uploads.

31. Security

Never:

Commit secrets

Hardcode API keys

Hardcode JWT secrets

Return password hashes

Trust client-provided roles

Trust client-provided user IDs when JWT identity exists

Allow unauthorized health-report access

Expose another user's private health data

Trust AI output blindly

Use environment variables for secrets.

Passwords must be hashed.

JWT must be verified on protected requests.

32. Privacy

Health information is sensitive.

Only authorized users should access their own health data.

Admin access should be limited to the functionality explicitly required by the project.

Do not log sensitive health information unnecessarily.

Do not include passwords, OTPs, or private health details in debug logs.

33. AI Prompt and External Input Safety

If an external AI model is used:

Treat AI output as untrusted data.

Validate structured output.

Do not execute AI-generated code.

Do not allow AI output to directly change permissions.

Do not allow AI output to directly create database records without validation.

Keep prompts and provider configuration outside business logic where practical.

Handle provider failures and timeouts.

The AI provider should be replaceable.

34. External Services

External services must be isolated behind interfaces.

Examples:

IEmailService
IAIService
IFoodRecognitionService
IFileStorageService
IPdfService

Business logic should depend on these interfaces rather than vendor SDKs.

This makes the application easier to replace, test, and maintain.

35. Reusability / DRY

Before creating a helper/service:

Search the project.

Check whether the functionality already exists.

Reuse it if appropriate.

Do not create multiple utilities for the same task.

Common reusable functionality may include:

Error classes

Response helpers

Date utilities

BMI calculation

Nutrition calculations

Authentication

Authorization

File validation

DTO mapping

PDF generation

Constants

Prefer useful reuse over artificial abstraction.

36. Frontend Architecture

The React application should separate:

Pages

Reusable components

Layouts

API services

Hooks

State management

Form validation

Authentication

Charts

Feature-specific UI

Suggested structure:

src/
├── components/
├── layouts/
├── pages/
│   ├── auth/
│   ├── user/
│   └── admin/
├── features/
│   ├── food/
│   ├── nutrition/
│   ├── health/
│   ├── meal/
│   ├── water/
│   └── reports/
├── services/
├── hooks/
├── utils/
├── constants/
├── types/
├── routes/
└── App.jsx

Do not place large business workflows inside React components.

API calls should be centralized in service modules where practical.

37. Frontend Authentication

Protected pages should use authentication state.

Example:

Login
 ↓
Receive JWT/session information
 ↓
Store securely according to application design
 ↓
Protected Route
 ↓
Authenticated User

Frontend route protection is for user experience.

Backend authorization is the real security boundary.

38. Dashboard Rules

The dashboard should not independently calculate different versions of the same metric.

Prefer:

Backend
 ↓
Dashboard API
 ↓
React Dashboard

The backend provides trusted totals for:

Calories

Water

BMI

Nutrition

Recent food logs

Recommendations

Charts should visualize API data rather than inventing values.

39. Recommendation Engine

Use a clear separation:

Food Data
+
User Profile
+
Goal
+
Allergies
+
Nutrition
 ↓
Recommendation Rules / AI
 ↓
Validated Recommendation
 ↓
Frontend

Recommendations should be explainable enough for a student project.

Example:

Reason:
High calorie content

Suggestion:
Consider a smaller portion and a healthier side.

Avoid unexplained or extreme recommendations.

40. Notifications

Notifications may include:

Meal reminder

Water reminder

Exercise reminder

Sleep reminder

Daily health tip

Do not build a complex notification system unless required.

Start with:

Notification
- userId
- type
- message
- scheduledAt
- read

Use scheduled jobs only when they are actually needed.

41. Testing

Important business logic should be tested.

Priority tests:

Registration

Login

OTP expiry

Password reset

BMI calculation

Food logging

Nutrition totals

Water totals

Recommendation rules

Role authorization

User data isolation

AI response validation

File upload validation

PDF generation

Do not depend only on frontend testing.

42. API Documentation

Important endpoints should document:

HTTP method

URL

Authentication requirement

Required role

Request body

Query parameters

Response structure

Success status

Error status

Example response

Keep API behavior consistent.

43. Naming

Use meaningful names.

Good:

CreateFoodLogUseCase
ScanFoodUseCase
GenerateRecommendationUseCase
FoodRepository
HealthProfileRepository
IFoodRecognitionService
CreateFoodLogDTO
FoodResponseDTO

Avoid vague names:

Helper
Manager
Common
Data
Thing
Temp
TestService

unless the name genuinely describes the responsibility.

44. Code Style — Human Developer Standard

Code should look like practical code written and maintained by a developer.

Avoid:

Excessive comments explaining obvious code

Extremely long functions

Generic variable names

Copy-pasted code

Unnecessary design patterns

Excessive abstraction

Deeply nested conditions

AI-generated boilerplate that does not fit the project

Over-engineering

Prefer:

Clear names

Small focused functions

Simple control flow

Reusable components

Meaningful abstractions

Existing project conventions

Practical comments only where reasoning is not obvious

The goal is maintainability, not architectural complexity.

45. Before Every Change

Before modifying or adding functionality:

Step 1

Understand the requirement.

Step 2

Find the existing related implementation.

Step 3

Trace the complete flow.

Route
 ↓
Middleware
 ↓
Controller
 ↓
DTO
 ↓
Use Case
 ↓
Repository / Service
 ↓
Model / External Service

Step 4

Check for reusable functionality.

Step 5

Check whether existing behavior could be affected.

Step 6

Implement the smallest clean change.

Step 7

Update related interfaces, types, DTOs, and API contracts.

Step 8

Check all consumers of changed functionality.

Step 9

Run tests, type checking, and linting where available.

Step 10

Verify the complete feature flow.

Never make an isolated change without understanding dependencies.

46. Final Feature Architecture

The main project should follow this flow:

                    USER / ADMIN
                         │
                         ▼
                    React Frontend
                         │
                         ▼
                    REST API
                         │
                         ▼
                      Routes
                         │
                         ▼
                 Auth / Role Middleware
                         │
                         ▼
                    Controller
                         │
                         ▼
                   Request DTO
                         │
                         ▼
                     Use Case
                    /        \
                   /          \
                  ▼            ▼
            Repository       Service
                │              │
                ▼              ▼
             MongoDB       AI / Email / PDF
                │
                ▼
            Response DTO
                │
                ▼
             Controller
                │
                ▼
             Frontend

47. AI Food Scanner Architecture

The specific AI flow should be:

User
 ↓
Capture / Upload Food Image
 ↓
File Validation
 ↓
AI Food Recognition
 ↓
Confidence / Result Validation
 ↓
Food Database Lookup
 ↓
Nutrition Information
 ↓
User Health Profile
 ↓
Recommendation Engine
 ↓
User Confirmation if Needed
 ↓
Save Food Log
 ↓
Dashboard / Report

Do not make the AI directly write to MongoDB.

48. Final Quality Checklist

Before considering a feature complete, verify:

Correct REST endpoint

Authentication applied

Authorization applied

Request validated

DTO created

DTO mapped correctly

Use Case contains business logic

Repository accessed through proper abstraction

External services accessed through interfaces

Dependencies injected where appropriate

Proper error handling

Correct HTTP status

Meaningful response message

No duplicated logic

No secrets in source code

User data isolation verified

AI output validated

Uploaded files validated

Related existing functionality checked

Existing behavior preserved

Tests added/updated where appropriate

Complete flow manually verified

49. Final Project Scope Recommendation

The project should be divided into:

Core Features

Admin authentication

User registration/login

Email OTP

Forgot/reset password

User profile

Health information

BMI calculation

User dashboard

Food logging

Nutrition analysis

Meal planner

Water tracker

Health reports

PDF report

Health education

Admin user management

Advanced Features

AI food recognition

Food image scanning

Food suitability analysis

Healthier alternatives

Personalized recommendations

Optional Features

Real-time camera recognition

Advanced portion estimation

Custom ML model training

Advanced nutrition prediction

Complex notification scheduling

Do not implement every advanced feature at once.

Build the core system first, then integrate AI.

50. Most Important Rule

Do not over-engineer this project.

The project should demonstrate:

MERN development

Authentication

CRUD operations

REST APIs

MongoDB

Admin/User roles

Health calculations

Charts and reports

AI integration

Clean architecture

It does NOT need unnecessary enterprise-level complexity.

Build features one by one, keep the code understandable, and make sure every feature works end-to-end before moving to the next one.