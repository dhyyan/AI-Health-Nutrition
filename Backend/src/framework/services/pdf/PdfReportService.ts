import PDFDocument from 'pdfkit';

export interface PdfReportData {
  title: string;
  userName: string;
  userEmail: string;
  generatedAt: string;
  periodText: string;
  metrics: {
    weightKg: number;
    heightCm: number;
    bmi: number;
    bmiCategory: string;
    totalCalories: number;
    avgCalories?: number;
    totalWaterMl: number;
    avgWaterMl?: number;
    totalProteinG: number;
    totalCarbsG: number;
    totalFatG: number;
  };
  dailyLogs?: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    waterMl: number;
    weightKg?: number;
    bmi?: number;
  }>;
  foodLogs?: Array<{
    foodName: string;
    mealType: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  }>;
}

export class PdfReportService {
  public static async generateReportBuffer(data: PdfReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Colors
        const primaryColor = '#059669'; // Emerald 600
        const secondaryColor = '#0f172a'; // Slate 900
        const lightBg = '#f8fafc'; // Slate 50
        const borderColor = '#e2e8f0'; // Slate 200

        // Header Banner
        doc
          .rect(0, 0, doc.page.width, 100)
          .fill(primaryColor);

        doc
          .fillColor('#ffffff')
          .fontSize(22)
          .font('Helvetica-Bold')
          .text('NutriAI Health Report', 40, 30);

        doc
          .fontSize(11)
          .font('Helvetica')
          .text(`${data.title} • Generated on ${data.generatedAt}`, 40, 60);

        doc.moveDown(3);
        let currentY = 120;

        // User Info Box
        doc
          .rect(40, currentY, doc.page.width - 80, 55)
          .fillAndStroke(lightBg, borderColor);

        doc
          .fillColor(secondaryColor)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(`User: ${data.userName}`, 55, currentY + 12);

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#64748b')
          .text(`Email: ${data.userEmail}`, 55, currentY + 30)
          .text(`Reporting Period: ${data.periodText}`, 300, currentY + 30);

        currentY += 75;

        // Summary Key Metrics Cards Grid
        doc
          .fillColor(secondaryColor)
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Summary Overview', 40, currentY);

        currentY += 20;

        const cardWidth = (doc.page.width - 80 - 30) / 4;
        const cardHeight = 65;
        const metricsList = [
          { label: 'Weight', value: `${data.metrics.weightKg || 'N/A'} kg`, sub: `BMI: ${data.metrics.bmi || 'N/A'}` },
          { label: 'BMI Status', value: `${data.metrics.bmiCategory || 'Normal'}`, sub: `${data.metrics.heightCm || 170} cm` },
          { label: 'Total Calories', value: `${Math.round(data.metrics.totalCalories)} kcal`, sub: data.metrics.avgCalories ? `Avg: ${Math.round(data.metrics.avgCalories)} kcal/day` : 'Daily Total' },
          { label: 'Water Consumed', value: `${(data.metrics.totalWaterMl / 1000).toFixed(1)} L`, sub: data.metrics.avgWaterMl ? `Avg: ${Math.round(data.metrics.avgWaterMl)} ml/day` : 'Daily Total' },
        ];

        metricsList.forEach((m, idx) => {
          const xPos = 40 + idx * (cardWidth + 10);
          doc
            .rect(xPos, currentY, cardWidth, cardHeight)
            .fillAndStroke('#f1f5f9', '#cbd5e1');

          doc
            .fillColor('#475569')
            .fontSize(9)
            .font('Helvetica')
            .text(m.label, xPos + 8, currentY + 8);

          doc
            .fillColor(primaryColor)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(m.value, xPos + 8, currentY + 23);

          doc
            .fillColor('#64748b')
            .fontSize(8)
            .font('Helvetica')
            .text(m.sub, xPos + 8, currentY + 45);
        });

        currentY += cardHeight + 25;

        // Nutrition Breakdown Box
        doc
          .fillColor(secondaryColor)
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Macronutrient Breakdown', 40, currentY);

        currentY += 20;

        doc
          .rect(40, currentY, doc.page.width - 80, 45)
          .fillAndStroke(lightBg, borderColor);

        doc
          .fillColor('#0284c7') // Protein Blue
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(`Protein: ${Math.round(data.metrics.totalProteinG)}g`, 60, currentY + 15);

        doc
          .fillColor('#d97706') // Carbs Amber
          .text(`Carbohydrates: ${Math.round(data.metrics.totalCarbsG)}g`, 220, currentY + 15);

        doc
          .fillColor('#e11d48') // Fat Rose
          .text(`Fats: ${Math.round(data.metrics.totalFatG)}g`, 400, currentY + 15);

        currentY += 65;

        // Daily Food Logs Table (if daily report)
        if (data.foodLogs && data.foodLogs.length > 0) {
          doc
            .fillColor(secondaryColor)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Logged Meals & Foods', 40, currentY);

          currentY += 20;

          // Table Header
          doc
            .rect(40, currentY, doc.page.width - 80, 22)
            .fill(primaryColor);

          doc
            .fillColor('#ffffff')
            .fontSize(9)
            .font('Helvetica-Bold')
            .text('Food Item', 50, currentY + 6)
            .text('Meal', 220, currentY + 6)
            .text('Calories', 300, currentY + 6)
            .text('Protein', 370, currentY + 6)
            .text('Carbs', 430, currentY + 6)
            .text('Fat', 490, currentY + 6);

          currentY += 22;

          data.foodLogs.slice(0, 15).forEach((item, index) => {
            const bg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
            doc
              .rect(40, currentY, doc.page.width - 80, 20)
              .fillAndStroke(bg, borderColor);

            doc
              .fillColor(secondaryColor)
              .fontSize(9)
              .font('Helvetica')
              .text(item.foodName.substring(0, 25), 50, currentY + 5)
              .text(item.mealType.toUpperCase(), 220, currentY + 5)
              .text(`${Math.round(item.calories)} kcal`, 300, currentY + 5)
              .text(`${Math.round(item.protein)}g`, 370, currentY + 5)
              .text(`${Math.round(item.carbohydrates)}g`, 430, currentY + 5)
              .text(`${Math.round(item.fat)}g`, 490, currentY + 5);

            currentY += 20;
          });

          currentY += 20;
        }

        // Daily Summaries Breakdown Table (if period report)
        if (data.dailyLogs && data.dailyLogs.length > 0) {
          if (currentY > doc.page.height - 200) {
            doc.addPage();
            currentY = 40;
          }

          doc
            .fillColor(secondaryColor)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Daily Trend Details', 40, currentY);

          currentY += 20;

          // Table Header
          doc
            .rect(40, currentY, doc.page.width - 80, 22)
            .fill(primaryColor);

          doc
            .fillColor('#ffffff')
            .fontSize(9)
            .font('Helvetica-Bold')
            .text('Date', 50, currentY + 6)
            .text('Calories', 140, currentY + 6)
            .text('Protein', 220, currentY + 6)
            .text('Carbs', 290, currentY + 6)
            .text('Fat', 360, currentY + 6)
            .text('Water (ml)', 420, currentY + 6)
            .text('Weight (kg)', 490, currentY + 6);

          currentY += 22;

          data.dailyLogs.forEach((item, index) => {
            if (currentY > doc.page.height - 60) {
              doc.addPage();
              currentY = 40;
            }

            const bg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
            doc
              .rect(40, currentY, doc.page.width - 80, 20)
              .fillAndStroke(bg, borderColor);

            doc
              .fillColor(secondaryColor)
              .fontSize(9)
              .font('Helvetica')
              .text(item.date, 50, currentY + 5)
              .text(`${Math.round(item.calories)}`, 140, currentY + 5)
              .text(`${Math.round(item.protein)}g`, 220, currentY + 5)
              .text(`${Math.round(item.carbs)}g`, 290, currentY + 5)
              .text(`${Math.round(item.fat)}g`, 360, currentY + 5)
              .text(`${item.waterMl} ml`, 420, currentY + 5)
              .text(item.weightKg ? `${item.weightKg} kg` : '-', 490, currentY + 5);

            currentY += 20;
          });

          currentY += 20;
        }

        // Footer & Medical Disclaimer
        if (currentY > doc.page.height - 80) {
          doc.addPage();
          currentY = doc.page.height - 80;
        } else {
          currentY = doc.page.height - 70;
        }

        doc
          .rect(40, currentY, doc.page.width - 80, 40)
          .fill('#f1f5f9');

        doc
          .fillColor('#64748b')
          .fontSize(8)
          .font('Helvetica-Oblique')
          .text(
            'Disclaimer: This report is generated automatically by NutriAI for informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment.',
            50,
            currentY + 10,
            { width: doc.page.width - 100, align: 'center' }
          );

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
