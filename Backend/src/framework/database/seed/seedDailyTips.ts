import { DailyTipModel } from '../models/DailyTipModel';

export const seedDailyTips = async (): Promise<void> => {
  try {
    const count = await DailyTipModel.countDocuments();
    if (count > 0) return;

    const tips = [
      {
        category: 'hydration',
        title: 'Start Your Morning with 500ml of Water',
        content: 'Drinking 500ml of water right after waking up helps jumpstart your metabolism by 24% and flushes out toxins accumulated overnight.',
        actionableStep: 'Keep a full glass or water bottle by your nightstand before going to sleep.',
        sourceOrTag: 'Hydration Science',
      },
      {
        category: 'nutrition',
        title: 'Prioritize Protein in Breakfast',
        content: 'Consuming 25-30g of high-quality protein for breakfast stabilizes blood glucose and reduces mid-day cravings dramatically.',
        actionableStep: 'Include eggs, Greek yogurt, or a plant-based protein scoop in your morning meal.',
        sourceOrTag: 'Metabolic Health',
      },
      {
        category: 'fitness',
        title: 'Take a 10-Minute Post-Meal Walk',
        content: 'A brief 10-minute light walk after your largest meal improves insulin sensitivity and prevents blood sugar spikes.',
        actionableStep: 'Step outside or stroll around your home immediately after finishing dinner.',
        sourceOrTag: 'Active Lifestyle',
      },
      {
        category: 'sleep',
        title: 'Power Down Screens 45 Mins Before Bed',
        content: 'Blue light emitted from phones and laptops suppresses melatonin production, delaying your sleep cycle and reducing deep sleep quality.',
        actionableStep: 'Enable night mode or switch to reading a physical book before bedtime.',
        sourceOrTag: 'Sleep Hygiene',
      },
      {
        category: 'mindfulness',
        title: 'Practice 4-7-8 Deep Breathing',
        content: 'Inhaling for 4 seconds, holding for 7, and exhaling for 8 activates the parasympathetic nervous system, lowering cortisol level.',
        actionableStep: 'Perform 3 cycles whenever you feel stress or right before your workout.',
        sourceOrTag: 'Wellness Focus',
      },
      {
        category: 'nutrition',
        title: 'Eat Colorfully (Rainbow Plate)',
        content: 'Consuming vegetables of varied colors ensures a broad spectrum of antioxidant phytonutrients like lycopene, lutein, and anthocyanins.',
        actionableStep: 'Add at least 3 distinct vegetable colors to your lunch or dinner plate today.',
        sourceOrTag: 'Micronutrient Boost',
      },
      {
        category: 'hydration',
        title: 'Electrolytes Matter with Water Intake',
        content: 'If drinking large volumes of water, ensure adequate sodium, potassium, and magnesium intake to preserve cellular hydration equilibrium.',
        actionableStep: 'Add a pinch of unrefined sea salt or a lemon slice to your afternoon water bottle.',
        sourceOrTag: 'Hydration Balance',
      },
      {
        category: 'fitness',
        title: 'Break Up Prolonged Sitting Every Hour',
        content: 'Sedentary stretches of over 60 minutes decrease muscle lipase enzyme activity by up to 90%.',
        actionableStep: 'Stand up and stretch for 60 seconds every hour during work hours.',
        sourceOrTag: 'Ergonomics',
      },
    ];

    await DailyTipModel.insertMany(tips);
    console.log('✅ Daily Health Tips database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Daily Health Tips:', error);
  }
};
