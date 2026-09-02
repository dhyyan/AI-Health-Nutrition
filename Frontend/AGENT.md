AGENTS.md — AI Health & Nutrition Management System Frontend Guidelines

1. Purpose

This document defines the mandatory frontend development standards for the AI-Based Personalized Health & Nutrition Management System.

The frontend must be:

Maintainable

Reusable

Type-safe where TypeScript is used

Component-driven

Scalable

Easy to understand

Consistent

Responsive

Free from unnecessary duplication

Integrated cleanly with the backend REST API

Recommended technology:

React

TypeScript

Redux Toolkit

React Router

Axios

Tailwind CSS

Recharts or Chart.js

React Hook Form where useful

The primary goal is:

Maximum useful reusability with minimum unnecessary code.

Do not create duplicate components, API functions, hooks, types, validation logic, or UI patterns when existing reusable implementations can be used.

2. IMPORTANT DEVELOPMENT RULE

Before creating or modifying any frontend code:

Understand the existing implementation.

Search for existing reusable components.

Search for existing hooks.

Search for existing API functions.

Search for existing Redux state.

Search for existing types/interfaces.

Search for existing validation logic.

Check whether the requested functionality already exists elsewhere.

Reuse existing code whenever appropriate.

Modify the smallest necessary area.

Check all related consumers after changing shared code.

NEVER create a new component simply because it is slightly easier than reusing an existing component.

3. Main Architecture

Use this general flow:

Page
  ↓
Reusable Components
  ↓
Custom Hooks
  ↓
Redux Toolkit / API Layer
  ↓
Axios
  ↓
Backend REST API

For server state:

Component
  ↓
Hook / Redux
  ↓
API Service
  ↓
Axios
  ↓
Backend

For UI-only state:

Component
  ↓
Local State

For global application state:

Component
  ↓
Redux Toolkit
  ↓
Slice

Do not put every piece of state into Redux.

4. Recommended Frontend Folder Structure

Use a feature-based structure:

src/
│
├── app/
│   ├── store.ts
│   ├── hooks.ts
│   └── router.tsx
│
├── assets/
│
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Pagination/
│   │   ├── Loader/
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   ├── ConfirmDialog/
│   │   ├── StatusBadge/
│   │   └── FileUploader/
│   │
│   ├── layout/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   └── PageContainer/
│   │
│   └── shared/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── authSlice.ts
│   │   ├── authApi.ts
│   │   ├── auth.types.ts
│   │   └── auth.validation.ts
│   │
│   ├── health/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── healthSlice.ts
│   │   ├── healthApi.ts
│   │   └── health.types.ts
│   │
│   ├── food/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── foodApi.ts
│   │   └── food.types.ts
│   │
│   ├── scanner/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── scannerApi.ts
│   │   └── scanner.types.ts
│   │
│   ├── nutrition/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── nutritionApi.ts
│   │   └── nutrition.types.ts
│   │
│   ├── recommendations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── recommendationApi.ts
│   │   └── recommendation.types.ts
│   │
│   ├── meals/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── mealApi.ts
│   │   └── meal.types.ts
│   │
│   ├── water/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── waterApi.ts
│   │   └── water.types.ts
│   │
│   ├── reports/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── reportApi.ts
│   │   └── report.types.ts
│   │
│   ├── articles/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── articleApi.ts
│   │   └── article.types.ts
│   │
│   └── notifications/
│       ├── components/
│       ├── hooks/
│       ├── notificationApi.ts
│       └── notification.types.ts
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   ├── scanner/
│   ├── nutrition/
│   ├── meals/
│   ├── water/
│   ├── reports/
│   ├── articles/
│   ├── admin/
│   └── errors/
│
├── services/
│   ├── api/
│   │   ├── axios.ts
│   │   └── apiClient.ts
│   └── storage/
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useModal.ts
│   └── usePagination.ts
│
├── types/
│   ├── api.ts
│   ├── common.ts
│   └── auth.ts
│
├── utils/
│   ├── bmi.ts
│   ├── date.ts
│   ├── format.ts
│   └── validation.ts
│
├── constants/
│   ├── routes.ts
│   ├── roles.ts
│   └── health.ts
│
├── App.tsx
└── main.tsx

Do not create all folders if they are not needed yet.

5. Maximum Reusability

Before creating something new, ask:

"Does this already exist?"

Search for:

Components

Hooks

API functions

Redux selectors

Redux actions

Types

Utilities

Validation schemas

Modal logic

Form logic

Table logic

Loading states

Error states

Charts

Status badges

File upload components

If it exists and is suitable, reuse it.

6. Component Reusability

Avoid duplicate components.

Bad:

UserButton.tsx
FoodButton.tsx
MealButton.tsx
WaterButton.tsx

when they all render the same type of button.

Create:

Button.tsx

and configure it through props.

Useful reusable components include:

Button

Input

Select

Modal

ConfirmDialog

DataTable

Pagination

Loader

EmptyState

ErrorState

StatusBadge

ProgressBar

StatCard

ChartCard

FileUploader

ImagePreview

7. Avoid Over-Reusability

Do not create components that are reusable only in theory.

Avoid things such as:

UniversalHealthComponent
DynamicEverything
GenericDashboardManager

when they make the code harder to understand.

Reusable code should:

Solve a real repeated problem

Have a clear responsibility

Be easy to configure

Be easier to use than duplicating code

Prefer practical reuse over abstraction for abstraction's sake.

8. DRY Principle

Avoid duplicate code.

Reuse:

Error messages

Empty states

Buttons

Inputs

Modals

Tables

Filters

Pagination

API error handling

Date formatting

Role checks

Status badges

Chart containers

BMI formatting

Nutrition formatting

Do not copy the same API/loading/error logic into many components.

9. Redux Toolkit

Redux Toolkit is required for global application state.

Use:

@reduxjs/toolkit

react-redux

createSlice

createAsyncThunk where appropriate

createSelector

configureStore

Do not use old-style Redux patterns with manually written action constants and switch reducers.

10. Do NOT Put Everything in Redux

Redux is not a replacement for React state.

Use local state for:

Modal open/close

Input values

Temporary UI state

Tabs

Dropdowns

Camera state

Image preview

Form state that does not need global access

Use Redux for:

Authenticated user

Authentication state

User role

Shared application state

Data genuinely consumed by multiple unrelated components

Do not create a Redux slice for every input field.

11. Typed Redux

If TypeScript is used, Redux must be fully typed.

Create:

useAppDispatch()
useAppSelector()

Avoid:

useDispatch<any>()
useSelector((state: any) => ...)

The Redux store should provide the correct types automatically.

12. API Layer

Components MUST NOT directly call Axios.

Bad:

const response = await axios.get("/food-logs");

inside a React component.

Use:

Component
  ↓
Hook
  ↓
foodApi.ts
  ↓
apiClient
  ↓
Axios

Example:

export const getFoodLogs = async (
  params: FoodLogFilterParams
): Promise<FoodLogListResponse> => {
  const response = await apiClient.get("/food-logs", { params });
  return response.data;
};

13. Axios Configuration

Create one centralized Axios client.

Configure:

Base URL

Authentication headers

Request interceptor

Response interceptor

Common error handling

Authentication expiration handling

Do NOT create multiple Axios instances unless there is a real reason.

14. JWT Handling

The backend is responsible for authorization.

Frontend should:

Receive authentication information after login.

Maintain authenticated user state.

Attach authentication information to protected API requests.

Handle expired/invalid authentication.

Redirect to login when authentication is no longer valid.

Do not manually attach tokens separately in every API call.

Use one centralized Axios interceptor where appropriate.

15. Role-Based UI

This project has at least:

USER
ADMIN

The frontend may hide or show UI based on role.

For example:

USER
→ Dashboard
→ Profile
→ Food Scanner
→ Nutrition
→ Meal Planner
→ Water
→ Reports

ADMIN
→ Admin Dashboard
→ User Management
→ Articles
→ FAQs
→ Food Management
→ User Reports

However:

Frontend role checks are NOT security.

Backend authorization remains the source of truth.

Never assume hiding a button provides security.

16. React Components

Components should have one clear responsibility.

Bad:

Dashboard.tsx

containing:

API calls

500 lines of JSX

Form validation

Table logic

Modal logic

Redux logic

Business calculations

Chart configuration

Instead:

Dashboard
├── SummaryCards
├── CalorieCard
├── WaterProgress
├── BMICard
├── NutritionSummary
├── RecentFoodHistory
├── RecommendationCard
└── HealthChart

Pages should compose components.

17. Pages vs Components

Pages represent screens/routes.

Examples:

/pages/dashboard/DashboardPage.tsx
/pages/scanner/FoodScannerPage.tsx
/pages/reports/HealthReportsPage.tsx
/pages/admin/UsersPage.tsx

Reusable components belong under components or the relevant feature.

Example:

/features/scanner/components/FoodScanner.tsx
/features/nutrition/components/NutritionCard.tsx
/features/water/components/WaterProgress.tsx

The page should coordinate the feature.

The component should focus on presentation and reusable UI behavior.

18. Custom Hooks

Use custom hooks to extract reusable React logic.

Examples:

useAuth()
useFoodScanner()
useFoodLogs()
useHealthProfile()
useWaterTracker()
useMealPlan()
useHealthReports()
useRecommendations()
useDebounce()
useModal()
usePagination()

Do not copy the same useEffect, loading state, error state, and API logic into multiple components.

19. Avoid Giant Hooks

Do not create:

useEverything()
useDashboardEverything()
useHealthManager()

A hook should have one clear responsibility.

Good:

useAuth()
useFoodScanner()
useWaterTracker()
useMealPlanner()
useHealthReports()

20. Forms

Forms must have:

Validation

Loading state

Error state

Success handling

Disabled submit while processing

Proper field messages

Important forms include:

Registration

Login

OTP verification

Forgot password

Reset password

Health profile

Food logging

Meal planning

Admin article creation/editing

Do not duplicate validation logic.

Use one validation schema per feature where appropriate.

21. Health Profile Form

The health profile form may contain:

Name

Age

Gender

Height

Weight

Blood group

Medical history

Diabetes status

Food allergies

Lifestyle habits

Profile picture

Frontend validation should check basic input correctness.

The backend must validate again.

Never expose health information unnecessarily in URLs, logs, or UI.

22. BMI UI

BMI should be calculated by the backend when it is part of application logic.

The frontend may calculate a temporary preview while editing height/weight.

Do not create different BMI results in different components.

Create a reusable utility for display:

calculateBMI()
getBMICategory()
formatBMI()

The backend remains the source of truth.

23. Dashboard

The dashboard should display trusted API data.

Possible sections:

Health Summary
├── BMI
├── Calories
├── Water
├── Health Score
└── Goal

Nutrition
├── Protein
├── Carbohydrates
├── Fat
└── Calories

Food History

AI Recommendation

Health Progress Charts

Do not create fake values merely to make the UI look complete unless they are explicitly seed/demo data.

24. AI Food Scanner UI

The scanner should support:

Image upload

Camera capture if implemented

Image preview

Remove/replace image

Scan action

Loading state

AI result

Confidence/uncertainty display where available

Nutrition result

Recommendation

Error state

Recommended flow:

Select/Capture Image
        ↓
Preview
        ↓
Validate
        ↓
Scan
        ↓
Loading
        ↓
AI Result
        ↓
Nutrition
        ↓
Recommendation
        ↓
User Confirmation if Needed

Do not put the AI recognition algorithm inside React.

The backend/AI service is responsible for recognition.

25. AI Result Safety

AI output is untrusted.

The frontend should:

Handle missing fields

Handle uncertain results

Handle API failures

Never assume the AI is always correct

Display estimated nutrition when appropriate

Allow user confirmation when required

Do not show an AI result as a guaranteed medical fact.

Example:

Detected food:
Chicken Biryani

Confidence:
82%

Nutrition:
Estimated values based on selected serving.

26. Nutrition UI

Nutrition cards/charts may display:

Calories

Protein

Carbohydrates

Fat

Fiber

Sugar

Sodium

Vitamins

Minerals

Use reusable components such as:

NutritionCard
NutritionSummary
MacroChart
NutritionProgress

Do not create separate custom cards with duplicated markup for every nutrient.

27. Personalized Recommendations UI

Recommendations should clearly show:

Recommendation

Reason

Food/meal involved

Alternative if available

Goal relevance

Estimated/educational nature where appropriate

Example:

Recommendation

Food: Burger

Reason:
High calorie content compared with your selected goal.

Alternative:
Grilled chicken sandwich.

Suggestion:
Consider a smaller portion and a healthier side.

Do not present the UI as medical diagnosis or guaranteed treatment.

28. Meal Planner UI

The meal planner can contain:

Today
├── Breakfast
├── Lunch
├── Snack
└── Dinner

Weekly Plan
├── Monday
├── Tuesday
├── Wednesday
├── Thursday
├── Friday
├── Saturday
└── Sunday

Use reusable:

MealCard

MealDayCard

MealTypeBadge

WeeklyMealGrid

The frontend should display plans received from the backend.

29. Water Tracker UI

Show:

Daily goal

Consumed amount

Remaining amount

Progress percentage

Quick add buttons

History

Progress chart

Example:

Today's Goal

1800 ml / 2500 ml

████████░░░ 72%

Water totals should come from the backend for trusted data.

30. Health Reports UI

Reports may contain:

Daily report

Weekly report

Monthly report

Nutrition analysis

Weight progress

BMI history

Water history

Calories

Health improvement graphs

PDF download

Use reusable:

ReportCard
HealthChart
DateRangeSelector
ReportTable
DownloadReportButton

Do not duplicate chart setup unnecessarily.

31. Charts

Use one charting library consistently.

Recommended:

Recharts, or

Chart.js

Possible charts:

Weight progress

BMI history

Calories

Macronutrients

Water intake

Weekly nutrition

Monthly progress

Charts should use real API data.

Do not create misleading health graphs from invented values.

32. Health Education

Health education pages can display:

Healthy food articles

Disease prevention information

Exercise guides

Nutrition awareness

Lifestyle improvement tips

FAQs

Use reusable:

ArticleCard
ArticleList
ArticleDetails
FAQItem
FAQList

Admin should manage content through APIs.

33. Notifications

The frontend can display:

Meal reminders

Water reminders

Exercise reminders

Sleep reminders

Daily health tips

Use reusable notification UI:

NotificationBell
NotificationList
NotificationItem

Browser notification permissions must be requested only when needed and clearly explained to the user.

34. Admin User Management

Admin screens should support:

User table

Search

Filters

Pagination

User profile

Block/unblock

Delete confirmation

Health report access where authorized

Use reusable:

DataTable
SearchInput
FilterPanel
Pagination
ConfirmDialog
StatusBadge

Never expose a user's private health information to unauthorized users.

35. Tables

The project contains multiple list views.

Create a reusable table component where appropriate:

<DataTable
  columns={columns}
  data={users}
  loading={loading}
  emptyMessage="No users found"
/>

Do not create a completely different table implementation for every page unless the behavior genuinely requires it.

36. Filters

Reusable filters may be needed for:

User status

Food category

Meal type

Report date

Notification status

Search

Avoid repeating the same input/select/filter logic.

37. Pagination

If the backend provides pagination, centralize the behavior.

Use:

usePagination()
<Pagination />

Avoid writing separate pagination logic for every list page.

38. Loading, Empty, and Error States

Every API-driven screen should consider:

Loading
Success
Empty
Error

Example:

if (loading) return <Loader />;

if (error) {
  return <ErrorState message={error} />;
}

if (!data.length) {
  return <EmptyState message="No food history found" />;
}

return <FoodTable data={data} />;

Use reusable components.

39. API Error Handling

Never silently ignore API errors.

Show meaningful messages:

Unable to load health data. Please try again.

Unable to scan this image. Please upload another image.

Your session has expired. Please login again.

You do not have permission to perform this action.

Do not expose raw backend/database errors directly to users.

40. File Uploads

For profile pictures and food images:

Show image preview

Validate file type

Validate file size

Show upload progress where useful

Allow replacing/removing selected image

Handle upload failure

Do not trust the original filename

The backend must also validate uploaded files.

Frontend validation is not a security boundary.

41. Camera Access

For real-time food scanning:

Request Camera Permission
        ↓
Open Camera
        ↓
Capture Image
        ↓
Preview
        ↓
Send to Scanner API
        ↓
Show Result

Handle:

Permission denied

No camera available

Mobile browser limitations

Loading state

Scan failure

Do not assume camera access will work on every device/browser.

42. Route Management

Keep routes centralized.

Example:

ROUTES.AUTH.LOGIN
ROUTES.DASHBOARD
ROUTES.PROFILE
ROUTES.SCANNER
ROUTES.NUTRITION
ROUTES.MEALS
ROUTES.WATER
ROUTES.REPORTS
ROUTES.ADMIN.USERS

Avoid scattering hard-coded route strings throughout the application.

43. React Router

Use:

Public Routes
    ↓
Login / Register

Protected Routes
    ↓
Application Layout

    ├── User Pages
    └── Admin Pages

Create reusable authentication and role protection.

Do not duplicate authentication checks across every page.

44. State Updates

Prefer predictable state updates.

Avoid unnecessary state duplication.

Bad:

foods
filteredFoods
sortedFoods
visibleFoods

all stored separately.

Prefer:

foods
filters

and derive filtered/sorted data when appropriate.

45. Selectors

When Redux state requires derived data, use selectors.

Examples:

selectCurrentUser
selectUserRole
selectIsAuthenticated
selectWaterProgress
selectNutritionSummary

For expensive derived calculations, use memoized selectors where appropriate.

Do not calculate the same derived state repeatedly across components.

46. Performance

Do not optimize everything prematurely.

First write clear code.

Use:

React.memo
useMemo
useCallback
lazy loading
code splitting

only when there is a real performance reason.

Do not wrap every component/function with them.

For large reports or dashboards, consider lazy-loading heavy chart components.

47. Accessibility

Maintain basic accessibility.

Use:

Proper labels

Buttons for actions

Meaningful input labels

Keyboard-accessible interactions

Appropriate ARIA attributes when required

Good color contrast

Error messages associated with fields

Alt text for meaningful images

Do not use clickable <div> elements when a button is appropriate.

48. Responsive UI

The application must work on:

Desktop

Tablet

Mobile

Important mobile screens:

Food scanner

Dashboard

Water tracker

Meal planner

Reports

Camera/image-upload functionality should be tested on mobile layouts.

Functionality and usability have priority over visual complexity.

49. Medical UI Safety

This is a health-related application.

The frontend must NOT make the product appear to be a medical diagnosis system.

Avoid labels such as:

Disease Prediction: You have diabetes

Prefer:

General Nutrition Guidance

or:

Your selected health information may affect this recommendation.

Include an appropriate disclaimer:

This application provides general health and nutrition information for educational purposes and is not a substitute for professional medical advice.

Do not present AI recommendations as guaranteed medical advice.

50. Human-Touch Code

The frontend must look like maintainable developer-written code.

Avoid:

Overly complex components

Huge files

Generic AI-generated abstractions

Excessive comments

Unnecessary hooks

Unnecessary Redux state

Duplicate components

Magic strings

any

Deeply nested JSX

Giant utility files

Over-engineered UI systems

Prefer:

Clear naming

Small components

Practical reusable components

Simple state management

Consistent patterns

Meaningful code

Easy-to-follow logic

The goal is:

Minimum unnecessary code + maximum useful reuse.

51. Before Modifying Shared Code

Be extra careful when changing:

API client

Redux store

Shared components

Common types

Authentication

Route protection

Shared hooks

Utilities

Design system components

Before changing them:

Find all usages.

Understand current behavior.

Check affected pages.

Make the smallest safe change.

Verify all consumers.

A shared component change can affect many pages.

52. Feature Independence

Features should not unnecessarily depend on each other's internal implementation.

For example:

features/scanner/

should not directly import private implementation details from:

features/nutrition/

Use:

Shared types

Shared components

Public feature APIs

Backend APIs

Keep feature boundaries clear.

53. File Size

Avoid unnecessarily large files.

If a component becomes difficult to understand, extract:

Child components

Hooks

Utilities

Types

Constants

But do not split every few lines into a separate file.

The goal is readability.

54. Frontend Business Logic Boundary

Do not move backend business rules into React.

The frontend may provide display calculations and previews, but the backend remains the source of truth for:

User authorization

Health report data

Food ownership

Nutrition totals where authoritative

Recommendation decisions

AI validation

User data access

PDF generation

Database operations

Frontend displays backend results.

55. API Response Handling

Assume the backend uses a consistent structure:

{
  "success": true,
  "message": "Food logged successfully",
  "data": {}
}

or:

{
  "success": false,
  "message": "Food could not be found",
  "error": {
    "code": "FOOD_NOT_FOUND"
  }
}

Create centralized handling for:

success

message

data

error

Avoid writing different error extraction logic in every API function.

56. Shared Types

Common API structures should be reusable.

Example:

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

Define types for:

API requests

API responses

Redux state

Components

Props

Forms

Filters

Food

Nutrition

Health profile

Meal plans

Water records

Reports

Recommendations

Errors

Avoid recreating the same response type in every feature.

57. Constants

Do not scatter magic strings throughout the application.

Create:

constants/
├── routes.ts
├── roles.ts
└── health.ts

Examples:

ROLES.USER
ROLES.ADMIN

MEAL_TYPES.BREAKFAST
MEAL_TYPES.LUNCH
MEAL_TYPES.DINNER
MEAL_TYPES.SNACK

HEALTH_GOALS.WEIGHT_LOSS
HEALTH_GOALS.WEIGHT_GAIN
HEALTH_GOALS.MUSCLE_GAIN

Likewise centralize:

Routes

Roles

Status values

Meal types

Health goals

Notification types

58. Date Handling

Health reports and food logs depend on dates.

Create reusable date utilities:

formatDate()
formatDateTime()
getStartOfDay()
getEndOfDay()

Do not format dates differently across pages.

For timezone-sensitive data, follow the backend API's timezone conventions.

59. PDF Reports

The frontend should request the report from the backend.

Recommended flow:

User clicks Download PDF
        ↓
Frontend calls report API
        ↓
Backend generates PDF
        ↓
Frontend receives file
        ↓
Browser downloads/opens PDF

Do not build complex health-report PDF business logic inside React.

60. Development Order

Build the frontend in this order:

Phase 1 — Foundation

Project setup

Routing

Axios client

Redux store

Common components

Authentication layout

Phase 2 — Authentication

Register

Login

OTP

Forgot password

Reset password

Protected routes

Role handling

Phase 3 — Health Profile

Profile page

Health information

BMI display

Profile picture

Phase 4 — Dashboard

Health summary

Calories

Water

BMI

Nutrition

Recent food history

Recommendations

Phase 5 — Food & Nutrition

Food logging

Food database UI

Nutrition details

Food scanner

Phase 6 — Recommendations & Meals

Recommendation UI

Meal planner

Weekly meal plan

Phase 7 — Water & Reports

Water tracker

History

Charts

Daily/weekly/monthly reports

PDF download

Phase 8 — Education & Notifications

Articles

FAQs

Notifications

Phase 9 — Admin

Admin dashboard

User management

Content management

User reports

Phase 10 — Polish

Responsive behavior

Accessibility

Error states

Loading states

Empty states

Performance checks

Final integration testing

Do not start with advanced AI UI before authentication and core data flows are working.

61. Final Feature Checklist

Before considering a frontend feature complete:

Component is reusable where appropriate

No duplicate component exists

API call is inside API layer

No direct Axios calls inside UI components

Redux used only when necessary

Redux state is typed

Request/response types exist

Loading state handled

Error state handled

Empty state handled

Form validation handled

Authentication handled

Role UI handled

Backend authorization still trusted

No magic strings

Shared constants used

Shared utilities reused

No unnecessary any

No unnecessary useMemo

No unnecessary useCallback

No unnecessary abstraction

Responsive layout checked

Accessibility basics checked

AI uncertainty/error states handled

Uploaded files validated on the UI

Existing related functionality checked

Existing components reused where possible

Complete user flow tested

62. Development Philosophy

Follow this priority:

Correctness
    ↓
Reusability
    ↓
Maintainability
    ↓
Type Safety
    ↓
Simplicity
    ↓
Performance
    ↓
Visual Polish

Do not sacrifice correctness for fewer lines of code.

Do not sacrifice readability for maximum abstraction.

Do not duplicate code merely to move faster.

Do not over-engineer simple requirements.

Always prefer the simplest reusable solution that fits the project.

63. Golden Rule

Before writing new frontend code:

SEARCH
  ↓
UNDERSTAND
  ↓
REUSE
  ↓
EXTEND
  ↓
ONLY THEN CREATE

Before changing existing code:

TRACE THE FLOW
  ↓
CHECK DEPENDENCIES
  ↓
MAKE THE SMALLEST SAFE CHANGE
  ↓
TEST

64. Final Frontend Architecture

For this project, keep the frontend flow clear:

                    React App
                        │
          ┌─────────────┴─────────────┐
          ↓                           ↓
      User Pages                  Admin Pages
          │                           │
          └─────────────┬─────────────┘
                        ↓
               Reusable Components
                        ↓
                  Custom Hooks
                        ↓
                 Redux / Local State
                        ↓
                    API Layer
                        ↓
                      Axios
                        ↓
                 Backend REST API
                        ↓
             Database / AI / Services

For the AI Food Scanner:

React Scanner
      ↓
Image Preview
      ↓
Upload API
      ↓
Backend
      ↓
AI Food Recognition
      ↓
Nutrition Lookup
      ↓
Recommendation Engine
      ↓
Validated Result
      ↓
React Result Screen

For health reports:

Reports Page
      ↓
Report Hook
      ↓
Report API
      ↓
Backend
      ↓
Health + Food + Water Data
      ↓
Report Response / PDF
      ↓
React Charts + Download

Most important: keep the frontend responsible for presentation, interaction, and UI state. Keep important business rules and sensitive health-data authorization on the backend.