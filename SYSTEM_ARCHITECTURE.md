# System Architecture & End-to-End Flow Specification
## AI-Based Personalized Health & Nutrition Management System (NutriAI)

---

## 1. Executive Summary

The **AI-Based Personalized Health & Nutrition Management System (NutriAI)** is a full-stack, enterprise-grade health, dietary tracking, and clinical wellness platform. The system pairs multimodal Artificial Intelligence (Google Gemini Vision) with deterministic clinical nutrition algorithms (Mifflin-St Jeor BMR/TDEE formulation, WHO BMI categorization, glycemic index evaluation, and allergy cross-referencing).

The architecture is divided into two primary subsystems:
1. **Frontend**: A modern Single Page Application (SPA) built with **React 18**, **TypeScript**, **Vite 6**, and **Tailwind CSS**, featuring custom React Hooks, Context-based reactive state, and Chart.js analytical visualizations.
2. **Backend**: An enterprise REST API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB / Mongoose**, engineered strictly around **Clean Architecture (Hexagonal / Ports-and-Adapters)** and **SOLID** principles.

---

## 2. High-Level System Architecture

The following diagram illustrates the complete high-level topology, showing the communication paths between the client browser, API gateways, layered backend components, MongoDB database, and external third-party services.

```mermaid
graph TB
    subgraph Client_Layer ["Client Layer (Browser / SPA)"]
        UI["React 18 + Vite SPA<br/>(Tailwind CSS + Lucide Icons)"]
        Router["React Router v7<br/>(Public, Protected & Admin Routes)"]
        Context["Context State Providers<br/>(AuthContext, NotificationContext)"]
        Hooks["Custom Domain Hooks<br/>(useDashboard, useWaterTracker, useMealPlanner, etc.)"]
        AxiosClient["Axios HTTP Client<br/>(JWT Interceptor + BaseURL Resolver)"]
        
        UI --> Router
        Router --> Context
        Context --> Hooks
        Hooks --> AxiosClient
    end

    subgraph Gateway_Layer ["Network & Gateway Layer"]
        ReverseProxy["Static File Server / Reverse Proxy<br/>(Vercel / Nginx)"]
        CORS["Express CORS & Body Parsers<br/>(JSON, URL-encoded, Static Uploads)"]
        AuthMiddleware["JWT Authentication & RBAC Middleware<br/>(authenticateJwt, requireRole)"]
        MulterMiddleware["Multer Storage Middleware<br/>(10MB Buffer / Disk Storage)"]
        
        AxiosClient -->|"HTTPS / REST API"| ReverseProxy
        ReverseProxy --> CORS
        CORS --> AuthMiddleware
        CORS --> MulterMiddleware
    end

    subgraph Backend_Clean_Arch ["Backend Layer (Clean Architecture)"]
        subgraph Adapters_Layer ["Adapters Layer"]
            Controllers["Express Controllers<br/>(Auth, User, Nutrition, Meal, Water, Report, etc.)"]
            Repos["Repository Implementations<br/>(UserRepository, MongoFoodRepository, etc.)"]
        end

        subgraph Application_Layer ["Use Cases (Application Business Rules)"]
            AuthUC["Auth & User Profile Use Cases"]
            ScanUC["ScanFoodImageUseCase (7-Step Engine)"]
            RecUC["GeneratePersonalizedRecommendationsUseCase"]
            MealUC["GenerateMealPlanUseCase & SwapSlotUseCase"]
            WaterUC["LogWaterIntake & GoalCalculation UseCases"]
            ReportUC["DashboardAggregation & PDFReport UseCases"]
            ReminderUC["TriggerScheduledRemindersUseCase"]
        end

        subgraph Domain_Layer ["Domain Layer (Core Business Rules)"]
            Entities["Domain Entities<br/>(User, HealthProfile, FoodLog, Meal, WaterIntake, etc.)"]
            Interfaces["Domain Ports & Interfaces<br/>(IRepositories, IServices, DTOs)"]
        end

        AuthMiddleware --> Controllers
        MulterMiddleware --> Controllers
        Controllers --> Application_Layer
        Application_Layer --> Domain_Layer
        Application_Layer --> Repos
        Repos -.->|"Implements"| Interfaces
    end

    subgraph Infrastructure_Layer ["Infrastructure & External Services"]
        MongoDB[("MongoDB Database<br/>(Mongoose Models & Indexes)")]
        GeminiAI["Google Gemini Vision API<br/>(gemini-2.0-flash / fallback cascade)"]
        SMTPService["Email Service / SMTP<br/>(Nodemailer / Brevo / Gmail)"]
        PDFGenerator["PDFKit Document Engine<br/>(A4 Vector Health Reports)"]
        CronWorker["Reminder Scheduler Worker<br/>(Node Interval 60s Polling)"]
        FileSystem["Local Storage / File System<br/>(/uploads/profiles & /uploads/scans)"]

        Repos --> MongoDB
        Application_Layer --> GeminiAI
        Application_Layer --> SMTPService
        Application_Layer --> PDFGenerator
        Controllers --> FileSystem
        CronWorker --> Application_Layer
    end
```

---

## 3. Backend Clean Architecture Deep-Dive

The backend source code under [`Backend/src`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src) is strictly partitioned according to Uncle Bob's Clean Architecture concentric circles. Dependencies point exclusively inwards:

```
┌────────────────────────────────────────────────────────────┐
│ Frameworks & Drivers (Express, Mongoose, Gemini, PDFKit)   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Interface Adapters (Controllers, Repositories, DTOs) │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ Use Cases (Application Business Rules)         │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │ Entities & Interfaces (Core Domain)      │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 3.1 Domain Layer (`Backend/src/domain/`)
The heart of the application containing zero external dependencies (no Express, no Mongoose):
- **Entities**: Pure TypeScript classes/interfaces modeling core business concepts:
  - [`User`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/User.ts)
  - [`HealthProfile`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/HealthProfile.ts)
  - [`FoodItem`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/FoodItem.ts)
  - [`FoodLog`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/FoodLog.ts)
  - [`Meal`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/Meal.ts)
  - [`Recommendation`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/Recommendation.ts)
  - [`WaterIntake`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/WaterIntake.ts)
  - [`Notification`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/Notification.ts)
  - [`ReminderSettings`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/ReminderSettings.ts)
  - [`WeightBmiLog`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/WeightBmiLog.ts)
  - [`Article`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/Article.ts)
  - [`Faq`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/Faq.ts)
  - [`DailyTip`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/domain/entities/DailyTip.ts)
- **Interfaces (Ports)**:
  - Repository interfaces (`IUserRepository`, `IHealthProfileRepository`, `IFoodRepository`, `IFoodLogRepository`, `IMealRepository`, `IMealPlanRepository`, `IWaterIntakeRepository`, `INotificationRepository`, `IReminderSettingsRepository`, etc.).
  - Service interfaces (`IFoodRecognitionService`, `INutritionDatabaseService`, `IPasswordService`, `IJwtService`, `IEmailService`, `IPdfReportService`).

### 3.2 Use Cases Layer (`Backend/src/useCases/`)
Encapsulates all application workflows, formulas, and validations:
- **Auth**: `RegisterUserUseCase`, `VerifyEmailOTPUseCase`, `LoginUserUseCase`, `ForgotPasswordUseCase`, `ResetPasswordUseCase`, `GetAuthenticatedUserUseCase`.
- **Nutrition & Vision**: `ScanFoodImageUseCase` (7-step AI pipeline), `AnalyzeNutritionUseCase`, `SearchFoodUseCase`, `GetFoodDetailsUseCase`.
- **Recommendations**: `GeneratePersonalizedRecommendationsUseCase`, `GetFoodAlternativesUseCase`.
- **Meals**: `GenerateMealPlanUseCase`, `GetUserMealPlanUseCase`, `SwapMealOptionUseCase`, `CreateMealUseCase`, `UpdateMealUseCase`, `DeleteMealUseCase`.
- **Water**: `LogWaterIntakeUseCase`, `GetWaterSummaryUseCase`, `UpdateWaterGoalUseCase`, `GetWaterHistoryUseCase`, `DeleteWaterIntakeUseCase`.
- **Reports & Dashboard**: `GetUserDashboardUseCase`, `GetDailyReportUseCase`, `GetWeeklyReportUseCase`, `GetMonthlyReportUseCase`, `GetHealthTrendsUseCase`, `LogWeightBmiUseCase`, `GeneratePdfReportUseCase`.
- **Reminders**: `TriggerScheduledRemindersUseCase`, `GetReminderSettingsUseCase`, `UpdateReminderSettingsUseCase`, `GetDailyHealthTipUseCase`.
- **User & Admin**: `GetHealthProfileUseCase`, `UpdateHealthProfileUseCase`, `UploadProfilePictureUseCase`, `AdminLoginUseCase`, `GetAllUsersUseCase`, `UpdateUserStatusUseCase`, `DeleteUserUseCase`.

### 3.3 Adapters Layer (`Backend/src/adapters/`)
Translates data between external formats (HTTP/Express requests, MongoDB docs) and internal Domain Use Cases:
- **Controllers**: Thin controllers that parse HTTP params/body, execute use cases, and format JSON responses (`AuthController`, `HealthProfileController`, `NutritionController`, `ScannerController`, `MealController`, `WaterIntakeController`, `ReportController`, `ReminderController`, `NotificationController`, `EducationController`, `AdminController`).
- **Repositories**: Mongoose-based data access implementations fulfilling the domain interfaces (`UserRepository`, `HealthProfileRepository`, `MongoFoodRepository`, `MongoFoodLogRepository`, `MongoMealRepository`, `MongoMealPlanRepository`, `WaterIntakeRepository`, `NotificationRepository`, `ReminderSettingsRepository`, `WeightBmiLogRepository`, `ArticleRepository`, `FaqRepository`, `DailyTipRepository`).
- **Middlewares**: `authenticateJwt`, `requireRole('admin')`, `profileUpload` (Multer), and `globalErrorHandler`.

### 3.4 Frameworks & Drivers Layer (`Backend/src/framework/`)
Connects to concrete technology implementations:
- **Database**: `connection.ts` (Mongoose connection pool), Mongoose Schema definitions (`UserModel`, `HealthProfileModel`, etc.), and automatic database seeders (`seedAdmin`, `seedMeals`, `seedDailyTips`, `seedEducation`).
- **Services**:
  - `ai/GeminiFoodRecognitionService.ts`: Direct Google Gemini REST API integration using base64 payload transfer with multi-model failover.
  - `pdf/PdfReportService.ts`: Vector PDF synthesis using PDFKit.
  - `email/EmailService.ts`: Nodemailer SMTP transporter for OTP and password resets.
  - `password/PasswordService.ts`: Bcrypt wrapper for cryptographic hashing and salt generation.
  - `jwt/JwtService.ts`: JsonWebToken signing and decoding.
  - `reminderScheduler.ts`: Singleton background cron runner that triggers scheduled reminder checks every 60 seconds.
- **Routes**: Modular Express routers mounted into [`app.ts`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/app.ts).

---

## 4. Frontend Architecture & Component Hierarchy

The frontend is structured around feature-based separation and reactive state synchronization:

```
Frontend/src/
├── components/          # Reusable presentation components
│   ├── admin/           # Admin modals (DeleteConfirm, UserProfile)
│   ├── common/          # ToastNotificationContainer, StatusBadge
│   ├── dashboard/       # CalorieCard, WaterCard, BmiStatus, HealthScore, etc.
│   ├── education/       # Admin article/FAQ modals
│   ├── layout/          # Navbar, AdminLayout, NotificationCenter
│   ├── meals/           # DailyMealCard, WeeklyPlanSchedule, MealDetailModal
│   ├── notifications/   # Reminder cards & DailyTipBanner
│   ├── nutrition/       # FoodLogHistoryList, SearchInput, NutritionAnalysisCard
│   ├── profile/         # BMICard, HealthProfileForm, PictureUploader
│   ├── recommendations/ # GoalPlanCard, FoodAlternativesCard, PortionGuidanceCard
│   └── water/           # WaterProgressWidget, HistoryTable, ReminderSettings
├── context/             # React Context Providers
│   ├── AuthContext.tsx         # User authentication, token lifecycle & session
│   └── NotificationContext.tsx # In-app notifications, browser notifications, sound synthesis
├── features/            # Complex multi-component feature domains
│   ├── reports/components/     # Daily/Weekly/Monthly report views & Chart.js components
│   └── scanner/components/     # CameraCaptureModal & ScannerResultCard
├── hooks/               # Domain Custom Hooks (encapsulating React state & API calls)
│   ├── useDashboard.ts         # Central health score & daily log coordinator
│   ├── useWaterTracker.ts      # Hydration calculations, quick additions, goal sync
│   ├── useMealPlanner.ts       # Meal plan fetching, generation, and slot swapping
│   ├── useRecommendations.ts  # Clinical diet & alternative suggestions
│   ├── useReminders.ts        # Timers, settings, and health tip triggers
│   ├── useHealthReports.ts    # Trend data aggregation & PDF download trigger
│   ├── useEducation.ts        # Articles, search, filter & FAQ accordion state
│   └── useAdminMeals.ts       # Master meal catalog CRUD operations
├── pages/               # Routed View Components
│   ├── admin/           # AdminLoginPage, AdminUsersPage, AdminMealsPage, AdminEducationPage
│   ├── auth/            # LoginPage, RegisterPage, VerifyOtpPage, ForgotPasswordPage
│   ├── meals/           # MealPlannerPage
│   ├── notifications/   # SmartNotificationsPage
│   ├── nutrition/       # NutritionPage
│   ├── profile/         # HealthProfilePageLayout with Personal, BMI, Medical, Lifestyle tabs
│   ├── recommendations/ # RecommendationsPage
│   ├── reports/         # HealthReportsPage
│   ├── scanner/         # FoodScannerPage
│   └── water/           # WaterTrackerPage
├── routes/              # Route Guards
│   ├── PublicRoute.tsx         # Restricts authenticated users from guest pages
│   ├── ProtectedRoute.tsx      # Requires valid JWT session
│   └── AdminRoute.tsx          # Requires authenticated user with role === 'admin'
└── services/            # Axios API Service Wrappers
    ├── api.ts                  # Axios instance with Bearer token injection
    ├── auth.service.ts
    ├── scannerApi.ts
    ├── nutritionApi.ts
    ├── mealApi.ts
    ├── waterApi.ts
    ├── recommendationApi.ts
    ├── reminderApi.ts
    ├── reportApi.ts
    ├── educationApi.ts
    ├── healthProfile.service.ts
    └── admin.service.ts
```

---

## 5. Detailed End-to-End System Flows

### Flow 1: User Registration, OTP Verification, Login & Session Management

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant RegisterUI as RegisterPage / VerifyOtpPage
    participant AuthService as auth.service.ts / Axios
    participant AuthRoutes as Express auth.routes.ts
    participant AuthCtrl as AuthController.ts
    participant RegisterUC as RegisterUserUseCase.ts
    participant UserRepo as UserRepository.ts
    participant PwdSvc as PasswordService (Bcrypt)
    participant EmailSvc as EmailService (Nodemailer)
    participant Mongo as MongoDB (UserModel)
    participant AuthCtx as AuthContext.tsx

    %% Registration
    User->>RegisterUI: Enters Name, Email, Password
    RegisterUI->>AuthService: register({ name, email, password })
    AuthService->>AuthRoutes: POST /api/auth/register
    AuthRoutes->>AuthCtrl: register(req, res)
    AuthCtrl->>RegisterUC: execute(dto)
    RegisterUC->>UserRepo: findByEmail(email)
    UserRepo->>Mongo: Query User
    Mongo-->>UserRepo: null (not found)
    RegisterUC->>PwdSvc: hash(password)
    PwdSvc-->>RegisterUC: passwordHash
    RegisterUC->>RegisterUC: Generate 6-digit OTP (10-min TTL)
    RegisterUC->>UserRepo: create(userEntity)
    UserRepo->>Mongo: insertOne(userDocument)
    RegisterUC->>EmailSvc: sendVerificationOTP(email, otp)
    EmailSvc-->>User: SMTP Email with 6-digit Code
    RegisterUC-->>AuthCtrl: User created (unverified)
    AuthCtrl-->>AuthService: 201 Created
    AuthService-->>RegisterUI: Redirect to /verify-otp

    %% Verification
    User->>RegisterUI: Enters 6-digit OTP
    RegisterUI->>AuthService: verifyOtp({ email, otp })
    AuthService->>AuthRoutes: POST /api/auth/verify-otp
    AuthRoutes->>AuthCtrl: verifyOtp(req, res)
    AuthCtrl->>UserRepo: verifyOTPAndActivate(email, otp)
    UserRepo->>Mongo: update({ isVerified: true, verificationOtp: null })
    AuthCtrl->>AuthCtrl: Generate JWT Token
    AuthCtrl-->>AuthService: 200 OK { token, user }
    AuthService-->>AuthCtx: login({ token, user })
    AuthCtx->>AuthCtx: localStorage.setItem('nutriai_token', token)
    AuthCtx-->>RegisterUI: Session Active -> Navigate to /dashboard
```

---

### Flow 2: AI Food Scanner & Computer Vision Multimodal Pipeline

This is the system's flagship AI pipeline. It executes a comprehensive 7-step clinical and nutritional evaluation upon receiving an image.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Camera / Upload)
    participant ScannerPage as FoodScannerPage.tsx
    participant ScannerApi as scannerApi.ts
    participant Route as POST /api/nutrition/scan
    participant Multer as Multer Memory Storage
    participant ScannerCtrl as ScannerController.ts
    participant ScanUC as ScanFoodImageUseCase.ts
    participant GeminiSvc as GeminiFoodRecognitionService.ts
    participant GeminiAPI as Google Gemini Vision API
    participant NutriSvc as NutritionDatabaseService.ts
    participant ProfileRepo as HealthProfileRepository.ts
    participant ResultCard as ScannerResultCard.tsx

    User->>ScannerPage: Captures photo via webcam or uploads file
    ScannerPage->>ScannerApi: scanFoodImage(file)
    ScannerApi->>Route: POST /api/nutrition/scan (multipart/form-data)
    Route->>Multer: Buffer image in memory (max 10MB)
    Route->>ScannerCtrl: scanImage(req, res)
    ScannerCtrl->>ScanUC: execute(imageBuffer, mimeType, filename, userId)

    %% 7-Step AI Pipeline
    critical Step 1: Multimodal AI Food Recognition
        ScanUC->>GeminiSvc: recognizeFoodFromImage(buffer)
        GeminiSvc->>GeminiAPI: POST models/gemini-2.0-flash:generateContent (Base64 + Prompt)
        alt Success
            GeminiAPI-->>GeminiSvc: JSON string { foodName, calories, macros, confidence }
        else Error / Timeout (12s)
            GeminiSvc->>GeminiSvc: Cascade to gemini-1.5-flash / fallback engine
        end
        GeminiSvc-->>ScanUC: RecognizedFoodResult
    end

    critical Step 2: Database Cross-Referencing
        ScanUC->>NutriSvc: findByNameOrAlias(recognized.foodName)
        NutriSvc-->>ScanUC: Verified USDA / Database Nutrition Lookup
    end

    critical Step 3: User Profile & Allergy Matching
        ScanUC->>ProfileRepo: findByUserId(userId)
        ProfileRepo-->>ScanUC: HealthProfile (Allergies, Diabetes status, Calorie target)
        ScanUC->>ScanUC: Check cross-reactivity with food items
    end

    critical Step 4: Health Suitability Scoring
        ScanUC->>ScanUC: Evaluate glycemic index, sodium, saturated fat against conditions
        ScanUC->>ScanUC: Assign rating ('highly_suitable' | 'moderate' | 'unsuitable')
    end

    critical Step 5: Healthier Alternatives Engine
        alt Food is calorie-dense or contradicts profile
            ScanUC->>NutriSvc: queryLowCalorieAlternatives(category)
            NutriSvc-->>ScanUC: FoodAlternativeComparison[] (Calorie savings & benefits)
        end
    end

    critical Step 6: Portion Guidance Synthesis
        ScanUC->>ScanUC: Compute hand-visual guide (Palm=Protein, Fist=Veggies, Cupped=Carbs)
    end

    critical Step 7: Final Summary & Medical Disclaimer Assembly
        ScanUC->>ScanUC: Assemble ScanResultDTO
    end

    ScanUC-->>ScannerCtrl: Complete ScanResultDTO
    ScannerCtrl-->>ScannerApi: 200 OK { success: true, data: ScanResultDTO }
    ScannerApi-->>ScannerPage: Update state: scanResult
    ScannerPage->>ResultCard: Render nutrition badges, warnings, macro breakdown & alternative swap button
```

---

### Flow 3: Nutrition Logging, Daily Caloric & Macro Calculation

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant NutritionUI as NutritionPage.tsx / ScannerResultCard
    participant NutriApi as nutritionApi.ts
    participant NutriRoute as POST /api/nutrition/logs
    participant NutriCtrl as NutritionController.ts
    participant CreateLogUC as CreateFoodLogUseCase.ts
    participant LogRepo as MongoFoodLogRepository.ts
    participant Mongo as MongoDB (FoodLogModel)
    participant DashboardHook as useDashboard.ts
    participant DashboardUI as DashboardPage.tsx

    User->>NutritionUI: Clicks "Add to Food Log" (MealType: Lunch, Portions: 1.5)
    NutritionUI->>NutriApi: logFoodItem({ foodName, mealType, servingSize, calories, macros... })
    NutriApi->>NutriRoute: POST /api/nutrition/logs (Bearer JWT)
    NutriRoute->>NutriCtrl: createFoodLog(req, res)
    NutriCtrl->>CreateLogUC: execute(userId, logDTO)
    CreateLogUC->>CreateLogUC: Calculate scaled calories and macros = baseline * portionMultiplier
    CreateLogUC->>LogRepo: create(foodLogEntity)
    LogRepo->>Mongo: insertOne(FoodLogDocument)
    Mongo-->>LogRepo: Saved Document
    CreateLogUC-->>NutriCtrl: Created FoodLog
    NutriCtrl-->>NutriApi: 201 Created { success: true, data: foodLog }
    NutriApi-->>NutritionUI: Toast: "Food successfully logged!"
    NutritionUI->>DashboardHook: refreshDashboard()
    DashboardHook->>DashboardHook: Re-fetch /api/reports/dashboard
    DashboardHook-->>DashboardUI: Re-renders Calorie Progress Ring, Remaining Calories & Macro Distribution
```

---

### Flow 4: Personalized Recommendation Engine (Mifflin-St Jeor Clinical Logic)

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant RecsPage as RecommendationsPage.tsx
    participant RecsApi as recommendationApi.ts
    participant RecsRoute as GET /api/recommendations
    participant RecsCtrl as RecommendationController.ts
    participant GenRecsUC as GeneratePersonalizedRecommendationsUseCase.ts
    participant ProfileRepo as HealthProfileRepository.ts
    participant LogRepo as MongoFoodLogRepository.ts
    participant Mongo as MongoDB

    User->>RecsPage: Navigates to /recommendations
    RecsPage->>RecsApi: getRecommendations()
    RecsApi->>RecsRoute: GET /api/recommendations (Bearer JWT)
    RecsRoute->>RecsCtrl: getPersonalizedRecommendations(req, res)
    RecsCtrl->>GenRecsUC: execute(userId)

    %% Clinical Calculations
    GenRecsUC->>ProfileRepo: findByUserId(userId)
    ProfileRepo->>Mongo: Query HealthProfile
    Mongo-->>ProfileRepo: { weightKg, heightCm, age, gender, goal, activityLevel, ... }
    ProfileRepo-->>GenRecsUC: HealthProfile Entity

    GenRecsUC->>GenRecsUC: Compute BMR via Mifflin-St Jeor Formula:<br/>BMR = 10*W + 6.25*H - 5*A (+5 for M / -161 for F)
    GenRecsUC->>GenRecsUC: Compute TDEE = BMR * ActivityMultiplier (1.2 / 1.55 / 1.75)
    GenRecsUC->>GenRecsUC: Calculate Calorie & Macro Targets based on Goal:<br/>- weight_loss: TDEE - 500 kcal, Protein 1.8g/kg<br/>- weight_gain: TDEE + 400 kcal, Carbs 55%<br/>- muscle_gain: TDEE + 250 kcal, Protein 2.2g/kg

    GenRecsUC->>LogRepo: findByUserIdAndDateRange(userId, startOfDay, endOfDay)
    LogRepo->>Mongo: Aggregate today's food logs
    Mongo-->>LogRepo: Total calories, protein, carbs, fat consumed today
    LogRepo-->>GenRecsUC: Actual Intake Metrics

    GenRecsUC->>GenRecsUC: Delta Analysis (Target vs Actual Intake)
    GenRecsUC->>GenRecsUC: Synthesize Disease-Specific Guidelines (Diabetic, Hypertensive, Low-Sodium)
    GenRecsUC->>GenRecsUC: Curate Recommended Food Choices & Health Alternatives

    GenRecsUC-->>RecsCtrl: PersonalizedRecommendations Object
    RecsCtrl-->>RecsApi: 200 OK { success: true, data: recommendations }
    RecsApi-->>RecsPage: Renders Goal Plan, Macro Comparison, Lifestyle Suggestions & Alternatives
```

---

### Flow 5: Intelligent Meal Planning & Automated Meal Slot Swapping

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant PlannerPage as MealPlannerPage.tsx
    participant MealApi as mealApi.ts
    participant MealRoutes as Express meal.routes.ts
    participant MealCtrl as MealController.ts
    participant GenPlanUC as GenerateMealPlanUseCase.ts
    participant SwapSlotUC as SwapMealOptionUseCase.ts
    participant MealRepo as MongoMealRepository.ts
    participant PlanRepo as MongoMealPlanRepository.ts
    participant ProfileRepo as HealthProfileRepository.ts
    participant Mongo as MongoDB

    %% Generation
    User->>PlannerPage: Clicks "Generate Weekly Meal Plan"
    PlannerPage->>MealApi: generateMealPlan()
    MealApi->>MealRoutes: POST /api/meals/plan/generate
    MealRoutes->>MealCtrl: generateMealPlan(req, res)
    MealCtrl->>GenPlanUC: execute(userId)
    GenPlanUC->>ProfileRepo: findByUserId(userId)
    ProfileRepo-->>GenPlanUC: { goal, dietaryPreference, foodAllergies }
    GenPlanUC->>MealRepo: findMatchingMeals(goal, dietaryPreference, excludedAllergies)
    MealRepo->>Mongo: Query Meal Collection
    Mongo-->>MealRepo: Filtered Master Meals (Breakfast, Lunch, Dinner, Snack)
    GenPlanUC->>GenPlanUC: Build 7-day balanced matrix with caloric distribution
    GenPlanUC->>PlanRepo: saveOrUpdatePlan(userId, weeklySchedule)
    PlanRepo->>Mongo: upsert(MealPlanDocument)
    GenPlanUC-->>MealCtrl: Generated MealPlan
    MealCtrl-->>MealApi: 200 OK
    MealApi-->>PlannerPage: Render 7-day interactive meal schedule

    %% Meal Swapping
    User->>PlannerPage: Clicks "Swap Meal" on Wednesday Lunch
    PlannerPage->>MealApi: swapMealSlot({ dayIndex: 2, mealType: 'lunch' })
    MealApi->>MealRoutes: POST /api/meals/plan/swap
    MealRoutes->>MealCtrl: swapMealSlot(req, res)
    MealCtrl->>SwapSlotUC: execute(userId, dayIndex, mealType)
    SwapSlotUC->>MealRepo: findAlternativeMeals(mealType, currentMealId)
    SwapSlotUC->>PlanRepo: updateSlotInSchedule(userId, dayIndex, mealType, newMeal)
    PlanRepo->>Mongo: Update schedule array
    SwapSlotUC-->>MealCtrl: Updated MealPlan
    MealCtrl-->>MealApi: 200 OK
    MealApi-->>PlannerPage: Instant UI swap with transition animation
```

---

### Flow 6: Hydration Tracking & Water Goal Calculation

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant WaterPage as WaterTrackerPage.tsx / QuickWidget
    participant WaterApi as waterApi.ts
    participant WaterRoutes as Express water.routes.ts
    participant WaterCtrl as WaterIntakeController.ts
    participant LogWaterUC as LogWaterIntakeUseCase.ts
    participant WaterRepo as WaterIntakeRepository.ts
    participant Mongo as MongoDB (WaterIntake & WaterGoal Models)

    User->>WaterPage: Clicks "+250 ml Glass" quick button
    WaterPage->>WaterApi: logWaterIntake(250)
    WaterApi->>WaterRoutes: POST /api/water/log { amountMl: 250 }
    WaterRoutes->>WaterCtrl: logIntake(req, res)
    WaterCtrl->>LogWaterUC: execute(userId, 250, optionalNotes)
    LogWaterUC->>WaterRepo: addIntake(userId, amountMl, todayString)
    WaterRepo->>Mongo: insertOne(WaterIntakeDocument)
    WaterRepo->>Mongo: aggregate today's total for userId
    Mongo-->>WaterRepo: { currentTotalMl: 1750, goalMl: 2500 }
    LogWaterUC-->>WaterCtrl: { intake, currentTotalMl, goalMl, percentage: 70 }
    WaterCtrl-->>WaterApi: 201 Created
    WaterApi-->>WaterPage: Update circular water ripple animation & progress bars
```

---

### Flow 7: Smart Notification & Background Worker Reminder Cycle

```mermaid
sequenceDiagram
    autonumber
    participant Cron as ReminderSchedulerService (Interval 60s)
    participant TriggerUC as TriggerScheduledRemindersUseCase.ts
    participant SettingsRepo as ReminderSettingsRepository.ts
    participant NotifRepo as NotificationRepository.ts
    participant TipRepo as DailyTipRepository.ts
    participant Mongo as MongoDB
    actor User as User Browser Session
    participant NotifCtx as NotificationContext.tsx
    participant WebAudio as Web Audio API Oscillator
    participant ToastUI as ToastNotificationContainer.tsx

    loop Every 60 Seconds
        Cron->>TriggerUC: execute()
        TriggerUC->>SettingsRepo: findActiveSettings()
        SettingsRepo->>Mongo: Query all enabled ReminderSettings
        Mongo-->>SettingsRepo: List of user reminder configurations

        TriggerUC->>TriggerUC: Get current server time (HH:mm)
        alt Time matches user's meal reminder (e.g. 13:00 Lunch)
            TriggerUC->>NotifRepo: createNotification({ userId, type: 'meal_reminder', title: 'Lunch Time', message: '...' })
            NotifRepo->>Mongo: insertOne(NotificationDocument)
        else Time matches water interval (e.g. every 60 mins)
            TriggerUC->>NotifRepo: createNotification({ userId, type: 'water_reminder', title: 'Hydration Alert', message: '...' })
            NotifRepo->>Mongo: insertOne(NotificationDocument)
        else Time matches daily tip time (e.g. 09:00)
            TriggerUC->>TipRepo: getRandomTip()
            TriggerUC->>NotifRepo: createNotification({ userId, type: 'health_tip', title: 'Tip of the Day', message: tip.content })
            NotifRepo->>Mongo: insertOne(NotificationDocument)
        end
    end

    %% Client-side consumption
    User->>NotifCtx: Polling / Window focus / Trigger check
    NotifCtx->>NotifRepo: GET /api/notifications
    NotifRepo-->>NotifCtx: Return newly created unread notifications
    NotifCtx->>WebAudio: playSound() (Generates synthetic 587Hz -> 880Hz chime)
    NotifCtx->>User: Browser Native Notification (if permission granted)
    NotifCtx->>ToastUI: Enqueue ToastItem (auto-dismiss in 5s)
```

---

### Flow 8: Health Analytics, Weight Progression & PDF Report Generation

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant ReportsPage as HealthReportsPage.tsx
    participant ReportApi as reportApi.ts
    participant ReportRoutes as Express report.routes.ts
    participant ReportCtrl as ReportController.ts
    participant PdfUC as GeneratePdfReportUseCase.ts
    participant DailyUC as GetDailyReportUseCase.ts
    participant WeeklyUC as GetWeeklyReportUseCase.ts
    participant MonthlyUC as GetMonthlyReportUseCase.ts
    participant PdfEngine as PdfReportService.ts (PDFKit)
    participant UserRepo as UserRepository.ts

    User->>ReportsPage: Clicks "Download Clinical PDF Report" (Period: 'weekly')
    ReportsPage->>ReportApi: downloadPdfReport('weekly')
    ReportApi->>ReportRoutes: GET /api/reports/download-pdf?period=weekly
    ReportRoutes->>ReportCtrl: downloadPdfReport(req, res)
    ReportCtrl->>PdfUC: execute(userId, 'weekly')

    PdfUC->>UserRepo: findById(userId)
    PdfUC->>WeeklyUC: execute(userId)
    WeeklyUC->>WeeklyUC: Aggregate 7-day calories, water, macro averages & weight delta
    WeeklyUC-->>PdfUC: Consolidated Report Data

    PdfUC->>PdfEngine: generateReportBuffer(pdfReportData)
    PdfEngine->>PdfEngine: Build vector document:<br/>- Branded header banner & logo<br/>- Patient info & BMI category badge<br/>- Calorie & Water intake summary table<br/>- Macro ratio pie breakdown<br/>- Detailed daily breakdown logs<br/>- Clinical health disclaimers
    PdfEngine-->>PdfUC: Binary PDF Buffer
    PdfUC-->>ReportCtrl: PDF Buffer
    ReportCtrl->>ReportCtrl: Set headers: Content-Type: application/pdf,<br/>Content-Disposition: attachment; filename=nutriai-report.pdf
    ReportCtrl-->>ReportApi: Stream binary octet-stream
    ReportApi-->>User: Browser prompts file download: "nutriai-weekly-health-report.pdf"
```

---

### Flow 9: Admin Backoffice & System Operations

```mermaid
sequenceDiagram
    autonumber
    actor Admin as System Administrator
    participant AdminUI as AdminMealsPage / AdminUsersPage
    participant AdminService as admin.service.ts / mealApi.ts
    participant AdminRoutes as Express admin.routes.ts / meal.routes.ts
    participant RBAC as requireRole('admin') Middleware
    participant AdminCtrl as AdminController.ts / MealController.ts
    participant AdminUC as UpdateUserStatusUseCase / CreateMealUseCase
    participant Repos as UserRepository / MongoMealRepository
    participant Mongo as MongoDB

    Admin->>AdminUI: Modifies user status ('active' -> 'blocked') OR creates master meal
    AdminUI->>AdminService: updateUserStatus(userId, 'blocked')
    AdminService->>AdminRoutes: PATCH /api/admin/users/:id/status (Bearer Admin JWT)
    AdminRoutes->>RBAC: Verify req.user.role === 'admin'
    alt Non-admin token
        RBAC-->>AdminService: 403 Forbidden ("Admin access required")
    else Admin confirmed
        RBAC->>AdminCtrl: updateUserStatus(req, res)
        AdminCtrl->>AdminUC: execute(userId, 'blocked')
        AdminUC->>Repos: updateStatus(userId, 'blocked')
        Repos->>Mongo: updateOne({ _id: userId }, { status: 'blocked' })
        Mongo-->>Repos: Acknowledged
        AdminUC-->>AdminCtrl: Success
        AdminCtrl-->>AdminService: 200 OK
        AdminService-->>AdminUI: Update table status badge to Red (Blocked)
    end
```

---

## 6. Complete Database Schema & Entity-Relationship Diagram (ERD)

The MongoDB database contains 14 specialized collections defined with Mongoose schemas in [`Backend/src/framework/database/models/`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/framework/database/models/).

```mermaid
erDiagram
    User ||--|| HealthProfile : "has profile"
    User ||--o{ FoodLog : "logs meals"
    User ||--o| MealPlan : "follows plan"
    User ||--o{ WaterIntake : "records hydration"
    User ||--o| WaterGoal : "configures goal"
    User ||--o{ WeightBmiLog : "tracks weight history"
    User ||--o| ReminderSettings : "configures alerts"
    User ||--o{ Notification : "receives alerts"
    
    FoodItem ||--o{ FoodLog : "referenced in log"
    Meal ||--o{ MealPlan : "composed into slots"
    
    Article }o--|| User : "authored by admin"
    Faq }o--|| User : "authored by admin"
    DailyTip }o--|| User : "authored by admin"

    User {
        ObjectId _id PK
        string name
        string email UK
        string passwordHash
        string role "user | admin"
        boolean isVerified
        string verificationOtp
        date otpExpiresAt
        string resetPasswordOtp
        date resetPasswordExpiresAt
        string status "active | blocked"
        string profilePicture
        date createdAt
        date updatedAt
    }

    HealthProfile {
        ObjectId _id PK
        ObjectId userId FK,UK
        number age
        string gender "male | female | other"
        number heightCm
        number weightKg
        string bloodGroup
        number bmi
        string bmiCategory "Underweight | Normal | Overweight | Obese"
        string goal "weight_loss | weight_gain | muscle_gain | maintenance"
        stringArray foodAllergies
        stringArray medicalHistory
        string activityLevel "sedentary | moderate | active"
        number sleepHours
        string dietaryPreference
        boolean hasDiabetes
        string diabetesStatus
        date createdAt
        date updatedAt
    }

    FoodItem {
        ObjectId _id PK
        string name UK
        string category
        number calories
        number protein
        number carbohydrates
        number fat
        number fiber
        number sugar
        number sodium
        number servingSize
        string servingUnit
        stringArray allergens
        stringArray dietaryTags
        boolean isVerified
    }

    FoodLog {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId foodItemId FK
        string foodName
        string mealType "breakfast | lunch | dinner | snack"
        number servingSize
        string servingUnit
        number calories
        number protein
        number carbohydrates
        number fat
        number fiber
        number sugar
        number sodium
        array vitaminsAndMinerals
        date loggedAt
    }

    Meal {
        ObjectId _id PK
        string name
        string mealType "breakfast | lunch | dinner | snack"
        string category
        string dietaryPreference "Vegetarian | Non-Vegetarian | Vegan | Keto | Pescatarian"
        stringArray suitableGoals
        stringArray allergens
        number calories
        number protein
        number carbohydrates
        number fat
        number fiber
        number servingSize
        string servingUnit
        stringArray ingredients
        string instructions
        string imageUrl
        boolean isVerified
    }

    MealPlan {
        ObjectId _id PK
        ObjectId userId FK,UK
        string startDate
        string goal
        string dietaryPreference
        stringArray excludedAllergies
        mixed weeklySchedule
        date generatedAt
    }

    WaterIntake {
        ObjectId _id PK
        ObjectId userId FK
        number amountMl
        string date "YYYY-MM-DD"
        date timestamp
        string notes
    }

    WaterGoal {
        ObjectId _id PK
        ObjectId userId FK,UK
        number dailyGoalMl
        date updatedAt
    }

    WeightBmiLog {
        ObjectId _id PK
        ObjectId userId FK
        number weightKg
        number heightCm
        number bmi
        string bmiCategory
        string date "YYYY-MM-DD"
        date recordedAt
    }

    ReminderSettings {
        ObjectId _id PK
        ObjectId userId FK,UK
        object meals
        object water
        object exercise
        object sleep
        object dailyTip
        boolean browserNotificationsEnabled
        boolean soundEnabled
    }

    Notification {
        ObjectId _id PK
        ObjectId userId FK
        string title
        string message
        string type "water_reminder | meal_reminder | exercise_reminder | sleep_reminder | health_tip | health_alert | system"
        boolean isRead
        string actionUrl
        date createdAt
    }

    Article {
        ObjectId _id PK
        string title
        string slug UK
        string category
        string summary
        string content
        string imageUrl
        number readTimeMinutes
        stringArray tags
        boolean isPublished
    }

    Faq {
        ObjectId _id PK
        string question
        string answer
        string category
        number order
        boolean isPublished
    }

    DailyTip {
        ObjectId _id PK
        string title
        string content
        string category
        boolean isActive
    }
```

---

## 7. REST API Route Catalog & Endpoint Specifications

All endpoints are prefixed with `/api` unless specified otherwise:

| Route Path | HTTP Verb | Auth Required | Role | Controller Action | Description |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **System & Health** | | | | | |
| `/health`, `/ping` | `GET` | No | Public | `healthController.check` | Keep-alive and uptime monitoring |
| **Authentication** | | | | | |
| `/api/auth/register` | `POST` | No | Public | `authController.register` | Register user & dispatch 6-digit OTP email |
| `/api/auth/verify-otp` | `POST` | No | Public | `authController.verifyOtp` | Verify OTP code & activate account |
| `/api/auth/resend-otp` | `POST` | No | Public | `authController.resendOtp` | Issue new OTP code |
| `/api/auth/login` | `POST` | No | Public | `authController.login` | Authenticate credentials & return JWT |
| `/api/auth/forgot-password` | `POST` | No | Public | `authController.forgotPassword` | Issue password reset email |
| `/api/auth/reset-password` | `POST` | No | Public | `authController.resetPassword` | Change password with valid OTP code |
| `/api/auth/me` | `GET` | Yes | Any | `authController.getMe` | Return current authenticated user profile |
| **Health Profile** | | | | | |
| `/api/user/profile` | `GET` | Yes | Any | `healthProfileController.getProfile` | Get comprehensive health & biometric data |
| `/api/user/profile` | `PUT` | Yes | Any | `healthProfileController.updateProfile`| Update biometric parameters, BMI, goals |
| `/api/user/profile/picture` | `POST` | Yes | Any | `healthProfileController.uploadPicture`| Upload avatar via Multer |
| **Nutrition & AI Scanner** | | | | | |
| `/api/nutrition/scan` | `POST` | Yes | Any | `scannerController.scanImage` | 7-Step Multimodal Gemini AI Vision Analysis |
| `/api/nutrition/search` | `GET` | Yes | Any | `nutritionController.searchFoods` | Query USDA / database foods by keyword |
| `/api/nutrition/food/:id` | `GET` | Yes | Any | `nutritionController.getFoodDetails` | Retrieve detailed nutrient micronutrients |
| `/api/nutrition/analyze` | `POST` | Yes | Any | `nutritionController.analyzeNutrition` | Calculate scaled nutrition for portion |
| `/api/nutrition/logs` | `POST` | Yes | Any | `nutritionController.createFoodLog` | Record daily meal intake log |
| `/api/nutrition/logs` | `GET` | Yes | Any | `nutritionController.getUserFoodLogs` | Retrieve food logs for date range |
| `/api/nutrition/logs/:id` | `DELETE` | Yes | Any | `nutritionController.deleteFoodLog` | Remove logged meal entry |
| **Recommendations** | | | | | |
| `/api/recommendations` | `GET` | Yes | Any | `recommendationController.getRecommendations` | Generate personalized dietary advice & TDEE |
| `/api/recommendations/alternatives` | `POST` | Yes | Any | `recommendationController.getAlternatives` | Retrieve healthier food substitutes |
| **Meal Planning** | | | | | |
| `/api/meals/plan` | `GET` | Yes | Any | `mealController.getUserMealPlan` | Retrieve current user weekly meal schedule |
| `/api/meals/plan/generate` | `POST` | Yes | Any | `mealController.generateMealPlan` | Generate fresh 7-day personalized plan |
| `/api/meals/plan/swap` | `POST` | Yes | Any | `mealController.swapMealSlot` | Swap meal in specific slot with alternative |
| `/api/meals` | `GET` | Yes | Any | `mealController.getAllMeals` | Search master meal catalog |
| `/api/meals` | `POST` | Yes | Admin | `mealController.createMeal` | Admin create master recipe item |
| `/api/meals/:id` | `PUT` | Yes | Admin | `mealController.updateMeal` | Admin update master recipe item |
| `/api/meals/:id` | `DELETE` | Yes | Admin | `mealController.deleteMeal` | Admin delete master recipe item |
| **Water Tracking** | | | | | |
| `/api/water/summary` | `GET` | Yes | Any | `waterIntakeController.getTodaySummary` | Today's intake, goal, and progress percent |
| `/api/water/log` | `POST` | Yes | Any | `waterIntakeController.logIntake` | Add water entry in milliliters |
| `/api/water/log/:intakeId`| `DELETE` | Yes | Any | `waterIntakeController.deleteIntake` | Delete specific water intake entry |
| `/api/water/goal` | `PUT` | Yes | Any | `waterIntakeController.updateGoal` | Set custom daily hydration goal (ml) |
| `/api/water/history` | `GET` | Yes | Any | `waterIntakeController.getHistory` | Query historical hydration by date range |
| **Smart Notifications & Reminders** | | | | | |
| `/api/reminders/settings` | `GET` | Yes | Any | `reminderController.getSettings` | Get scheduled reminder configurations |
| `/api/reminders/settings` | `PUT` | Yes | Any | `reminderController.updateSettings` | Update meal, water, sleep schedules |
| `/api/reminders/tip/daily`| `GET` | Yes | Any | `reminderController.getDailyTip` | Retrieve cached tip of the day |
| `/api/reminders/trigger-check`| `POST` | Yes | Any | `reminderController.triggerCheck` | Force evaluation of user reminder triggers |
| `/api/notifications` | `GET` | Yes | Any | `notificationController.getNotifications` | Fetch in-app notifications |
| `/api/notifications/read-all`| `PATCH` | Yes | Any | `notificationController.markAllAsRead` | Bulk acknowledge all notifications |
| `/api/notifications/:id/read`| `PATCH` | Yes | Any | `notificationController.markAsRead` | Mark single notification as read |
| `/api/notifications/:id` | `DELETE` | Yes | Any | `notificationController.deleteNotification` | Delete notification item |
| **Health Reports & Analytics** | | | | | |
| `/api/reports/dashboard` | `GET` | Yes | Any | `reportController.getDashboard` | Main dashboard summary & health score |
| `/api/reports/daily` | `GET` | Yes | Any | `reportController.getDailyReport` | 24-hour nutrition & water summary |
| `/api/reports/weekly` | `GET` | Yes | Any | `reportController.getWeeklyReport` | 7-day intake rolling averages |
| `/api/reports/monthly` | `GET` | Yes | Any | `reportController.getMonthlyReport` | 30-day comprehensive analytics |
| `/api/reports/trends` | `GET` | Yes | Any | `reportController.getTrends` | Historical macro & caloric trend points |
| `/api/reports/weight-bmi` | `POST` | Yes | Any | `reportController.logWeightBmi` | Log weight entry & compute BMI trajectory |
| `/api/reports/download-pdf`| `GET` | Yes | Any | `reportController.downloadPdfReport` | Stream generated PDF report |
| **Health Education & FAQ** | | | | | |
| `/api/education/articles` | `GET` | No | Public | `educationController.getArticles` | Retrieve published wellness articles |
| `/api/education/articles/:id`| `GET` | No | Public | `educationController.getArticleById` | Read full article by ID or slug |
| `/api/education/faqs` | `GET` | No | Public | `educationController.getFaqs` | Retrieve categorized health FAQs |
| `/api/education/admin/articles`| `POST`/`PUT`/`DELETE` | Yes | Admin | `educationController.*` | Admin article CMS operations |
| `/api/education/admin/faqs` | `POST`/`PUT`/`DELETE` | Yes | Admin | `educationController.*` | Admin FAQ CMS operations |
| **Admin Governance** | | | | | |
| `/api/admin/login` | `POST` | No | Public | `adminController.login` | Admin dedicated authentication |
| `/api/admin/users` | `GET` | Yes | Admin | `adminController.getAllUsers` | Paginated user management directory |
| `/api/admin/users/:id` | `GET` | Yes | Admin | `adminController.getUserProfile` | Deep inspection of user biometric profile |
| `/api/admin/users/:id/status`| `PATCH`| Yes | Admin | `adminController.updateUserStatus` | Block or reactivate user account |
| `/api/admin/users/:id` | `DELETE`| Yes | Admin | `adminController.deleteUser` | Hard delete user and cascade dependencies |

---

## 8. Security, Resiliency & Production Best Practices

### 8.1 Authentication & Authorization Matrix
1. **Stateless JWT Tokens**: Tokens are signed using `HS256` with a configurable expiration (`JWT_EXPIRES_IN=7d`). Payloads contain `{ id, email, role }`.
2. **Bearer Token Injection**: Handled transparently by Axios request interceptors on the client (`Frontend/src/services/api.ts`).
3. **Role-Based Access Control (RBAC)**: Enforced via `requireRole('admin')` middleware. Admin endpoints reject standard `user` tokens with `403 Forbidden`.
4. **Password Cryptography**: Passwords undergo Bcrypt hashing with a minimum of 10 salt rounds. Plaintext passwords are never persisted or logged.

### 8.2 AI Engine High Availability & Fallback Strategy
To guarantee that the user experience is never blocked by third-party AI rate limits or network degradation, [`GeminiFoodRecognitionService`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/framework/services/ai/GeminiFoodRecognitionService.ts) implements:
- **12-Second Per-Model Timeout**: Uses `AbortController` to terminate lagging HTTP requests.
- **Model Cascade**: Sequentially attempts:
  1. `gemini-flash-latest`
  2. `gemini-2.0-flash`
  3. `gemini-1.5-flash-latest`
  4. `gemini-2.5-flash-image`
- **Zero-Block Fallback Estimation**: If all remote API requests fail or the API key is missing, the service falls back to a nutritional estimation model, ensuring that the scanner UI never hangs indefinitely in a loading state.

### 8.3 Input Validation & Centralized Error Handling
1. **Zod & Custom DTO Validators**: Validates request parameters (emails, password complexities, numeric ranges for weight and height) before execution reaches the Use Cases.
2. **AppError Hierarchy**: Operational errors extend the [`AppError`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/shared/errors/AppError.ts) base class with appropriate HTTP status codes (400, 401, 403, 404, 409).
3. **Global Error Middleware**: Unhandled exceptions are intercepted by [`globalErrorHandler`](file:///home/dhyan/Documents/Freelance/AI%20Healt%20Nutrition/Backend/src/adapters/middlewares/error.middleware.ts), sanitizing stack traces in production (`NODE_ENV === 'production'`) and formatting standard JSON error structures.

---

## 9. Summary

This document captures the end-to-end architecture of the **AI-Based Personalized Health & Nutrition Management System**. By decoupling UI concerns (React/Tailwind) from domain business logic (Clean Architecture Use Cases) and abstracting infrastructure components (MongoDB, Google Gemini, PDFKit, Nodemailer), the codebase maintains high maintainability, testability, and operational resilience.
