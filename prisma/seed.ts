import { PrismaClient } from '@prisma/client';
import { 
  mockUsers, 
  mockFarms, 
  mockBiosecurityRecords, 
  mockHealthRecords, 
  mockRiskAssessments, 
  mockRiskAlerts, 
  mockVisitors, 
  mockInspections, 
  mockNotifications, 
  mockDiseaseReports 
} from '../src/mock-data/index';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database records...');
  // Delete in reverse dependency order to avoid foreign key errors
  await prisma.notification.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.symptomInReport.deleteMany();
  await prisma.diseaseReport.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.visitor.deleteMany();
  await prisma.riskAlert.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.symptomInRecord.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.healthRecord.deleteMany();
  await prisma.biosecurityRecord.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding symptoms dictionary...');
  const symptomsData = ["Cough", "Fever", "Diarrhea", "Breathing difficulty", "Loss of appetite", "Sudden death"];
  const symptomsMap: Record<string, string> = {};
  
  for (const name of symptomsData) {
    const s = await prisma.symptom.create({ data: { name } });
    symptomsMap[name] = s.id;
  }

  console.log('Seeding mock users...');
  const userMap: Record<string, string> = {};
  for (const u of mockUsers) {
    const createdUser = await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: '$2b$10$EpFjNS1s8556f8f43/mock-password-hash', // dummy bcrypt hash
        role: u.role,
        phone: u.phone,
        district: u.district || null,
        state: u.state || null
      }
    });
    userMap[u.id] = createdUser.id;
  }

  console.log('Seeding mock farms...');
  const farmMap: Record<string, string> = {};
  for (const f of mockFarms) {
    const createdFarm = await prisma.farm.create({
      data: {
        id: f.id,
        name: f.name,
        farmerId: f.farmerId,
        lat: f.lat,
        lng: f.lng,
        address: f.address,
        district: f.district,
        state: f.state,
        biosecurityScore: f.biosecurityScore,
        riskLevel: f.riskLevel,
        species: f.species
      }
    });
    farmMap[f.id] = createdFarm.id;
  }

  console.log('Seeding biosecurity records...');
  for (const b of mockBiosecurityRecords) {
    await prisma.biosecurityRecord.create({
      data: {
        id: b.id,
        farmId: b.farmId,
        date: new Date(b.date),
        disinfection: b.disinfection,
        footbath: b.footbath,
        quarantine: b.quarantine,
        ppe: b.ppe,
        otherChecks: b.otherChecks,
        complianceRate: b.complianceRate
      }
    });
  }

  console.log('Seeding health records...');
  for (const h of mockHealthRecords) {
    const hr = await prisma.healthRecord.create({
      data: {
        id: h.id,
        farmId: h.farmId,
        date: new Date(h.date),
        totalAnimals: h.totalAnimals,
        healthyCount: h.healthyCount,
        sickCount: h.sickCount,
        mortalityCount: h.mortalityCount,
        notes: h.notes || null,
        species: h.species
      }
    });

    // Create relation items for symptoms in record
    if (h.symptoms && h.symptoms.length > 0) {
      for (const symName of h.symptoms) {
        const sId = symptomsMap[symName];
        if (sId) {
          await prisma.symptomInRecord.create({
            data: {
              healthRecordId: hr.id,
              symptomId: sId
            }
          });
        }
      }
    }
  }

  console.log('Seeding risk assessments...');
  const assessmentMap: Record<string, string> = {};
  for (const ra of mockRiskAssessments) {
    const createdAssessment = await prisma.riskAssessment.create({
      data: {
        id: ra.id,
        farmId: ra.farmId,
        date: new Date(ra.date),
        score: ra.score,
        level: ra.level,
        factors: JSON.stringify(ra.factors),
        details: ra.details
      }
    });
    assessmentMap[ra.id] = createdAssessment.id;
  }

  console.log('Seeding risk alerts...');
  const alertMap: Record<string, string> = {};
  for (const al of mockRiskAlerts) {
    // Only link if assessment exists in mapping
    const assId = mockRiskAssessments.find(a => a.farmId === al.farmId)?.id || "risk-4";
    const createdAlert = await prisma.riskAlert.create({
      data: {
        id: al.id,
        farmId: al.farmId,
        assessmentId: assessmentMap[assId] || assessmentMap["risk-4"],
        level: al.level,
        status: al.status,
        message: al.message,
        createdAt: new Date(al.date)
      }
    });
    alertMap[al.id] = createdAlert.id;
  }

  console.log('Seeding visitors and vehicles...');
  for (const v of mockVisitors) {
    const createdVisitor = await prisma.visitor.create({
      data: {
        id: v.id,
        farmId: v.farmId,
        name: v.name,
        phone: v.phone,
        purpose: v.purpose,
        entryTime: new Date(v.entryTime),
        exitTime: v.exitTime ? new Date(v.exitTime) : null,
        qrCode: v.qrCode,
        status: v.status
      }
    });

    if (v.plateNumber && v.vehicleType) {
      await prisma.vehicle.create({
        data: {
          visitorId: createdVisitor.id,
          plateNumber: v.plateNumber,
          type: v.vehicleType,
          disinfectionStatus: v.disinfectionStatus || false,
          entryTime: new Date(v.entryTime),
          exitTime: v.exitTime ? new Date(v.exitTime) : null
        }
      });
    }
  }

  console.log('Seeding disease reports...');
  for (const dr of mockDiseaseReports) {
    // find farmer user
    const farmer = mockUsers.find(u => u.name === dr.reportedBy) || mockUsers[0];
    const createdRep = await prisma.diseaseReport.create({
      data: {
        id: dr.id,
        farmId: dr.farmId,
        reportedById: farmer.id,
        notes: dr.notes,
        status: dr.status,
        species: dr.species || 'POULTRY',
        createdAt: new Date(dr.date)
      }
    });

    if (dr.symptoms && dr.symptoms.length > 0) {
      for (const symName of dr.symptoms) {
        const sId = symptomsMap[symName];
        if (sId) {
          await prisma.symptomInReport.create({
            data: {
              diseaseReportId: createdRep.id,
              symptomId: sId
            }
          });
        }
      }
    }
  }

  console.log('Seeding inspections...');
  for (const ins of mockInspections) {
    // Find vet officer
    const officer = mockUsers.find(u => u.name === ins.officerName) || mockUsers[6];
    await prisma.inspection.create({
      data: {
        id: ins.id,
        farmId: ins.farmId,
        inspectorId: officer.id,
        date: new Date(ins.date),
        notes: ins.notes,
        status: ins.status,
        actionsTaken: ins.actionsTaken || null
      }
    });
  }

  console.log('Seeding notifications...');
  for (const n of mockNotifications) {
    await prisma.notification.create({
      data: {
        id: n.id,
        userId: n.userId,
        title: n.title,
        message: n.message,
        read: n.read,
        type: n.type,
        createdAt: new Date(n.date)
      }
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
