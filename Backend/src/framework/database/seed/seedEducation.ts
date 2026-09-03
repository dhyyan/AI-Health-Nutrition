import { ArticleModel } from '../models/ArticleModel';
import { FaqModel } from '../models/FaqModel';

export const seedEducation = async (): Promise<void> => {
  try {
    const articleCount = await ArticleModel.countDocuments();
    if (articleCount === 0) {
      const articles = [
        {
          title: 'Top 10 Superfoods for Immunity & Vitality',
          slug: 'top-10-superfoods-immunity-vitality',
          summary: 'Discover nutrient-dense whole foods like leafy greens, berries, chia seeds, and turmeric that supercharge your immune system naturally.',
          category: 'healthy_food',
          readTimeMinutes: 4,
          imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
          tags: ['Superfoods', 'Immunity', 'Antioxidants', 'Nutrition'],
          content: `Nutrient density is the core metric of optimal food choices. Superfoods are foods—mostly plant-based—that are thought to be nutritionally dense and good for one's health.

### 1. Dark Leafy Greens
Kale, spinach, and Swiss chard are loaded with vitamins A, C, and K, as well as essential minerals like calcium and iron.

### 2. Berries
Blueberries, raspberries, and blackberries contain potent anthocyanins that protect cellular integrity against oxidative stress.

### 3. Fermented Foods
Greek yogurt, kefir, kimchi, and sauerkraut provide live beneficial probiotics that fortify the gut microbiome, which houses over 70% of human immune cells.

### 4. Fatty Fish & Seeds
Salmon, chia seeds, and walnuts supply anti-inflammatory Omega-3 fatty acids vital for heart and cognitive health.`,
          isPublished: true,
          isFeatured: true,
          createdBy: 'NutriAI Health Team',
        },
        {
          title: 'Understanding & Preventing Type 2 Diabetes',
          slug: 'understanding-preventing-type-2-diabetes',
          summary: 'Educational insights into insulin sensitivity, glycemic control, and actionable dietary choices to lower your risk.',
          category: 'disease_prevention',
          readTimeMinutes: 5,
          imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
          tags: ['Diabetes Prevention', 'Insulin', 'Glycemic Index', 'Blood Sugar'],
          medicalDisclaimer: 'This article provides general health and nutrition education only. It is not intended as medical diagnosis, prescription, or treatment.',
          content: `Type 2 Diabetes occurs when the body becomes resistant to insulin or fails to produce sufficient insulin to regulate blood glucose levels.

### Key Lifestyle Interventions
1. **Focus on Low-Glycemic Foods**: Prioritize complex carbohydrates such as oats, legumes, quinoa, and non-starchy vegetables that absorb slowly without spiking blood sugar.
2. **Eliminate Liquid Sugars**: Soda, sweetened teas, and fruit juices digest rapidly, leading to steep glucose surges.
3. **Daily Physical Movement**: Contracted muscles absorb glucose independently of insulin, enhancing insulin sensitivity for up to 48 hours post-exercise.
4. **Maintain Waist-to-Height Ratio**: Excess abdominal visceral fat releases inflammatory cytokines that impair glucose uptake.`,
          isPublished: true,
          isFeatured: true,
          createdBy: 'Clinical Education Board',
        },
        {
          title: 'Cardiovascular Health: Reducing Blood Pressure Naturally',
          slug: 'cardiovascular-health-reducing-blood-pressure',
          summary: 'Learn how dietary potassium, sodium management, and stress control contribute to healthy blood vessels.',
          category: 'disease_prevention',
          readTimeMinutes: 5,
          imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80',
          tags: ['Heart Health', 'Hypertension', 'Sodium', 'Potassium'],
          medicalDisclaimer: 'This educational guide is for informational purposes only. Do not stop prescribed cardiac medications without consulting your physician.',
          content: `Hypertension (high blood pressure) is often referred to as a silent risk factor. Simple daily habits significantly aid blood vessel relaxation.

### 1. Balance the Sodium-Potassium Ratio
Excess sodium encourages water retention in blood vessels. Potassium rich foods (bananas, avocados, sweet potatoes) encourage kidney sodium excretion and arterial vasodilation.

### 2. The DASH Dietary Pattern
Emphasizes fruits, vegetables, whole grains, lean poultry, and nuts while curtailing saturated fats and refined sugars.`,
          isPublished: true,
          isFeatured: false,
          createdBy: 'Wellness Research Team',
        },
        {
          title: 'Full Body Morning Energy & Mobility Routine',
          slug: 'full-body-morning-energy-mobility-routine',
          summary: 'A 15-minute low-impact movement guide designed to unlock tight joints, activate your core, and boost morning energy.',
          category: 'exercise_guide',
          readTimeMinutes: 6,
          imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
          tags: ['Mobility', 'Morning Routine', 'Flexibility', 'Calisthenics'],
          difficulty: 'Beginner',
          exerciseSteps: [
            {
              stepNumber: 1,
              title: 'Cat-Cow Spine Lubrication',
              description: 'On hands and knees, slowly arch your back looking up on inhalation, then round your spine pulling chin to chest on exhalation. Repeat for 60 seconds.',
            },
            {
              stepNumber: 2,
              title: 'World’s Greatest Stretch',
              description: 'Step into a deep forward lunge with back leg straight. Place opposite hand on ground and rotate torso lifting top hand toward ceiling. Hold 30 sec per side.',
            },
            {
              stepNumber: 3,
              title: 'Bodyweight Squats to Heel Raises',
              description: 'Squat down keeping chest tall, push through heels to stand, and finish by raising onto tiptoes. Perform 15 controlled repetitions.',
            },
            {
              stepNumber: 4,
              title: 'Glute Bridges with 2-Second Hold',
              description: 'Lie on your back with knees bent and feet flat. Squeeze glutes and raise hips until shoulders and knees align. Hold 2s at the top. Perform 12 reps.',
            },
          ],
          content: `Consistent morning movement warms up joint synovial fluid, releases muscle tension from sleep, and stimulates endorphins for enhanced alertness.`,
          isPublished: true,
          isFeatured: true,
          createdBy: 'Fitness & Movement Coach',
        },
        {
          title: 'Macronutrients Explained: Protein, Carbs & Fats',
          slug: 'macronutrients-explained-protein-carbs-fats',
          summary: 'Demystify calories and learn how to balance your daily macronutrient ratios tailored to your fitness goals.',
          category: 'nutrition_awareness',
          readTimeMinutes: 4,
          imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
          tags: ['Macros', 'Calories', 'Protein', 'Hydration', 'Energy'],
          content: `All food energy is measured in Calories, derived from three primary macronutrients:

- **Protein (4 Calories/gram)**: Essential for muscle repair, enzymatic activity, and hormone production. Aim for 1.2g to 2.0g per kg of body weight depending on activity.
- **Carbohydrates (4 Calories/gram)**: Primary energy source for brain and muscle glycogen stores. Choose complex, fiber-rich sources.
- **Dietary Fats (9 Calories/gram)**: Crucial for hormone synthesis (testosterone, estrogen), brain health, and fat-soluble vitamin absorption (Vitamins A, D, E, K).`,
          isPublished: true,
          isFeatured: false,
          createdBy: 'NutriAI Education Board',
        },
        {
          title: 'Mastering Sleep Hygiene & Stress Reduction',
          slug: 'mastering-sleep-hygiene-stress-reduction',
          summary: 'Practical evening rituals and circadian alignment strategies to optimize restorative deep sleep.',
          category: 'lifestyle_tips',
          readTimeMinutes: 5,
          imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
          tags: ['Sleep', 'Cortisol', 'Wellness', 'Mindfulness'],
          content: `Quality sleep is the non-negotiable foundation of metabolic health, immune defense, and mental clarity.

### Practical Wellness Habits
1. **Get Direct Sunlight Upon Waking**: 10-15 minutes of early morning sunlight sets your circadian clock, signaling melatonin release 14 hours later.
2. **Cool Down Your Bedroom**: The body requires a 1-2°C drop in core temperature to initiate deep sleep. Keep your room around 18-20°C (65-68°F).
3. **Establish a Wind-Down Buffer**: Stop intense work and screens 60 minutes before target bedtime.`,
          isPublished: true,
          isFeatured: false,
          createdBy: 'Lifestyle Specialist',
        },
      ];

      await ArticleModel.insertMany(articles);
      console.log('✅ Educational Articles seeded successfully');
    }

    const faqCount = await FaqModel.countDocuments();
    if (faqCount === 0) {
      const faqs = [
        {
          question: 'How does NutriAI estimate calorie and nutrient requirements?',
          answer: 'NutriAI calculates your basal metabolic rate (BMR) using the Mifflin-St Jeor equation based on your weight, height, age, gender, and selected health goals (e.g., weight loss, maintenance, muscle gain).',
          category: 'Nutrition',
          order: 1,
          isPublished: true,
        },
        {
          question: 'Is the health information provided a replacement for medical diagnosis?',
          answer: 'No. All articles, recommendations, and disease prevention tips provided by NutriAI are for general educational purposes only. They are not intended as medical diagnosis, prescription, or clinical treatment.',
          category: 'Disease Prevention',
          order: 2,
          isPublished: true,
        },
        {
          question: 'Can I follow the exercise guides if I am a beginner?',
          answer: 'Yes! Our exercise guides are categorized by difficulty levels (Beginner, Intermediate, Advanced). Beginner guides feature low-impact bodyweight exercises with step-by-step form instructions.',
          category: 'Exercise',
          order: 3,
          isPublished: true,
        },
        {
          question: 'How often should I log my daily water intake?',
          answer: 'We recommend logging your water whenever you consume a glass or bottle. You can also set automated reminders in the Smart Reminders section to keep you on track throughout the day.',
          category: 'App Usage',
          order: 4,
          isPublished: true,
        },
        {
          question: 'How can Admins manage articles and FAQ entries?',
          answer: 'Admins can navigate to the Admin Console under "Health Education / FAQs" to create new articles, write step-by-step exercise guides, publish or draft articles, and update or delete FAQ entries in real time.',
          category: 'App Usage',
          order: 5,
          isPublished: true,
        },
      ];

      await FaqModel.insertMany(faqs);
      console.log('✅ FAQ entries seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding Health Education data:', error);
  }
};
