import { PrismaClient, Difficulty, Severity, ItemType, RelationType, SubmissionStatus } from '@prisma/client';
import { ddiaChapters } from './seedData';
import { dsaPatterns, dsaProblems } from './seedDsa';
import { generateProblemSpec } from './dsaCatalogBuilder';
import { getSectionEnhancement, chapterCheatSheets } from './ddiaEnhancer';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Personal Interview Training OS...');

  // 1. Upsert Default User
  const user = await prisma.user.upsert({
    where: { email: 'alok@engineer.internal' },
    update: {},
    create: {
      id: 'user-default-1',
      email: 'alok@engineer.internal',
      name: 'Alok',
      streak: 4,
      longestStreak: 7,
      totalStudyMinutes: 185,
      dsaReadiness: 68.0,
      sysDesignReadiness: 62.0,
      overallReadiness: 65.5,
      lastActiveAt: new Date(),
    },
  });
  console.log(`👤 User verified: ${user.name} (${user.email})`);

  // 2. Seed BookParts, Chapters, Sections, Concepts
  console.log('📚 Seeding DDIA System Design Academy (11 Canonical Chapters)...');
  const conceptMap = new Map<string, string>(); // slug -> id

  for (const ch of ddiaChapters) {
    const part = await prisma.bookPart.upsert({
      where: { partNumber: ch.partNumber },
      update: { title: ch.partTitle },
      create: {
        partNumber: ch.partNumber,
        title: ch.partTitle,
      },
    });

    const chapter = await prisma.chapter.upsert({
      where: { chapterNumber: ch.chapterNumber },
      update: {
        title: ch.title,
        sourcePages: ch.sourcePages,
        summary: ch.summary,
        learningObjectives: ch.learningObjectives,
        cheatSheet: (chapterCheatSheets[ch.chapterNumber] as any) || undefined,
      },
      create: {
        partId: part.id,
        chapterNumber: ch.chapterNumber,
        title: ch.title,
        sourcePages: ch.sourcePages,
        summary: ch.summary,
        learningObjectives: ch.learningObjectives,
        cheatSheet: (chapterCheatSheets[ch.chapterNumber] as any) || undefined,
      },
    });

    for (const sec of ch.sections) {
      const enhancement = getSectionEnhancement(ch.chapterNumber, sec.sectionNumber, sec.title);
      let section = await prisma.section.findFirst({
        where: { chapterId: chapter.id, sectionNumber: sec.sectionNumber },
      });
      if (!section) {
        section = await prisma.section.create({
          data: {
            chapterId: chapter.id,
            sectionNumber: sec.sectionNumber,
            title: sec.title,
            pageStart: sec.pageStart,
            pageEnd: sec.pageEnd,
            content: enhancement.content,
            simpleExplanation: enhancement.simpleExplanation,
            analogy: enhancement.analogy,
            keyQuestions: enhancement.keyQuestions,
          },
        });
      } else {
        section = await prisma.section.update({
          where: { id: section.id },
          data: {
            title: sec.title,
            pageStart: sec.pageStart,
            pageEnd: sec.pageEnd,
            content: enhancement.content,
            simpleExplanation: enhancement.simpleExplanation,
            analogy: enhancement.analogy,
            keyQuestions: enhancement.keyQuestions,
          },
        });
      }

      for (const cpt of sec.concepts) {
        const concept = await prisma.concept.upsert({
          where: { slug: cpt.slug },
          update: {
            name: cpt.name,
            summary: cpt.summary,
            whyItMatters: cpt.whyItMatters,
            coreMechanics: cpt.coreMechanics,
            visualType: cpt.visualType,
            scenarioProblem: cpt.scenarioProblem,
            interviewPrompt: cpt.interviewPrompt,
            tradeoffs: cpt.tradeoffs,
            technologies: cpt.technologies,
            sourceRef: cpt.sourceRef,
          },
          create: {
            chapterId: chapter.id,
            sectionId: section.id,
            name: cpt.name,
            slug: cpt.slug,
            summary: cpt.summary,
            whyItMatters: cpt.whyItMatters,
            coreMechanics: cpt.coreMechanics,
            visualType: cpt.visualType,
            scenarioProblem: cpt.scenarioProblem,
            interviewPrompt: cpt.interviewPrompt,
            tradeoffs: cpt.tradeoffs,
            technologies: cpt.technologies,
            sourceRef: cpt.sourceRef,
          },
        });
        conceptMap.set(cpt.slug, concept.id);

        // Seed initial ConceptMastery
        await prisma.conceptMastery.upsert({
          where: {
            userId_conceptId: {
              userId: user.id,
              conceptId: concept.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            conceptId: concept.id,
            recognitionScore: 75.0,
            understandingScore: 65.0,
            recallScore: 60.0,
            applicationScore: 55.0,
            interviewExplanationScore: 60.0,
            overallScore: 62.5,
            lastStudiedAt: new Date(Date.now() - 86400000 * 2),
          },
        });
      }
    }
  }

  // 3. Seed Concept Relations (Graph edges)
  console.log('🕸️ Seeding Concept Knowledge Graph edges...');
  const relations = [
    { from: 'leader-failover-split-brain', to: 'replication-lag-anomalies', type: RelationType.RELATED_TO, note: 'Failover can cause replica data loss and lag anomalies.' },
    { from: 'replication-lag-anomalies', to: 'dynamo-quorums-version-vectors', type: RelationType.BUILDS_UPON, note: 'Quorums mitigate replication lag in leaderless topologies.' },
    { from: 'snapshot-isolation-mvcc', to: 'write-skew-and-phantoms', type: RelationType.CONTRASTS_WITH, note: 'Snapshot isolation stops read skew but fails to prevent write skew.' },
    { from: 'write-skew-and-phantoms', to: 'serializability-mechanisms', type: RelationType.PREREQUISITE, note: 'Understanding write skew motivates Serializable Snapshot Isolation.' },
    { from: 'unreliable-clocks-truetime', to: 'fencing-tokens-process-pauses', type: RelationType.RELATED_TO, note: 'Fencing tokens safeguard against clock skew and lease pauses.' },
    { from: 'linearizability-vs-serializability', to: 'lamport-timestamps-total-order-broadcast', type: RelationType.PREREQUISITE, note: 'Total order broadcast is equivalent to consensus and linearizability.' },
    { from: '2pc-vs-consensus-raft', to: 'lamport-timestamps-total-order-broadcast', type: RelationType.BUILDS_UPON, note: 'Consensus protocols provide non-blocking atomic total order.' },
    { from: 'dual-writes-vs-cdc', to: 'log-based-message-brokers', type: RelationType.BUILDS_UPON, note: 'CDC pipes transaction logs into Kafka to avoid dual-write hazards.' },
    { from: 'stream-table-duality-event-sourcing', to: 'dual-writes-vs-cdc', type: RelationType.RELATED_TO, note: 'Mathematical duality of state as integral of events.' },
  ];

  for (const rel of relations) {
    const fromId = conceptMap.get(rel.from);
    const toId = conceptMap.get(rel.to);
    if (fromId && toId) {
      await prisma.conceptRelation.upsert({
        where: {
          fromConceptId_toConceptId_relationType: {
            fromConceptId: fromId,
            toConceptId: toId,
            relationType: rel.type,
          },
        },
        update: { note: rel.note },
        create: {
          fromConceptId: fromId,
          toConceptId: toId,
          relationType: rel.type,
          note: rel.note,
        },
      });
    }
  }

  // 4. Seed DSA Patterns
  console.log('⚡ Seeding DSA Patterns...');
  const patternMap = new Map<string, string>();
  for (const p of dsaPatterns) {
    const pattern = await prisma.dsaPattern.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        category: p.category,
        levelRange: p.levelRange,
        description: p.description,
      },
      create: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        levelRange: p.levelRange,
        description: p.description,
      },
    });
    patternMap.set(p.slug, pattern.id);

    // Seed pattern weakness record for user
    await prisma.patternWeakness.upsert({
      where: {
        userId_patternId: {
          userId: user.id,
          patternId: pattern.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        patternId: pattern.id,
        successRate: p.slug === 'dp-1d' ? 0.35 : p.slug === 'sliding-window' ? 0.45 : 0.72,
        attemptsCount: p.slug === 'dp-1d' ? 12 : 6,
        isFlaggedWeak: p.slug === 'dp-1d' || p.slug === 'sliding-window',
        recommendedDrill: p.slug === 'dp-1d' ? 'State transition formulation drill' : 'Sliding window contraction invariant drill',
      },
    });
  }

  // 5. Seed all 498 DSA Problems with problem-specific statements, signatures, and test cases
  console.log(`🧩 Seeding all ${dsaProblems.length} DSA Problems across 23 levels...`);
  const seededProblems = [];
  for (const prob of dsaProblems) {
    const patternId = patternMap.get(prob.patternSlug);
    const spec = generateProblemSpec(prob);

    const p = await prisma.dsaProblem.upsert({
      where: { slug: prob.slug },
      update: {
        title: prob.title,
        level: prob.level,
        difficulty: prob.difficulty,
        patternId: patternId,
        topic: prob.topic,
        subtopic: prob.subtopic || prob.topic,
        statement: spec.statement,
        executionModel: spec.executionModel,
        functionName: spec.functionName,
        parameterDefinitions: spec.parameterDefinitions,
        returnType: spec.returnType,
        constraints: spec.constraints,
        examples: spec.examples,
        starterTemplates: spec.starterTemplates,
        optimalSolution: spec.optimalSolution,
        optimalTimeComplexity: spec.optimalTimeComplexity,
        optimalSpaceComplexity: spec.optimalSpaceComplexity,
        commonMistakes: spec.commonMistakes,
        hints: spec.hints,
      },
      create: {
        leetcodeId: prob.num,
        title: prob.title,
        slug: prob.slug,
        level: prob.level,
        difficulty: prob.difficulty,
        patternId: patternId,
        topic: prob.topic,
        subtopic: prob.subtopic || prob.topic,
        estimatedTimeMin: prob.difficulty === 'EASY' ? 15 : prob.difficulty === 'MEDIUM' ? 25 : 45,
        statement: spec.statement,
        executionModel: spec.executionModel,
        functionName: spec.functionName,
        parameterDefinitions: spec.parameterDefinitions,
        returnType: spec.returnType,
        constraints: spec.constraints,
        examples: spec.examples,
        starterTemplates: spec.starterTemplates,
        optimalSolution: spec.optimalSolution,
        optimalTimeComplexity: spec.optimalTimeComplexity,
        optimalSpaceComplexity: spec.optimalSpaceComplexity,
        commonMistakes: spec.commonMistakes,
        hints: spec.hints,
      },
    });
    seededProblems.push(p);

    // Clean up old default test cases and insert problem-specific test cases
    await prisma.testCase.deleteMany({
      where: { problemId: p.id },
    });

    for (let tcIdx = 0; tcIdx < spec.testCases.length; tcIdx++) {
      const tc = spec.testCases[tcIdx];
      await prisma.testCase.create({
        data: {
          id: `tc-${p.slug}-${tcIdx + 1}`,
          problemId: p.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          explanation: tc.explanation || null,
        },
      });
    }
  }

  // 6. Seed Spaced Repetition items for Today's Training
  console.log('🔄 Seeding Spaced Repetition Items & Mistake Journal...');
  const firstProblem = seededProblems[0]; // Two Sum
  const slidingProblem = seededProblems.find(p => p.slug === 'longest-substring-without-repeating-characters') || seededProblems[72];

  if (firstProblem) {
    await prisma.revisionItem.upsert({
      where: { id: 'rev-dsa-1' },
      update: { nextReviewDate: new Date() },
      create: {
        id: 'rev-dsa-1',
        userId: user.id,
        itemType: ItemType.DSA_PROBLEM,
        dsaProblemId: firstProblem.id,
        repetitionNumber: 2,
        intervalDays: 3,
        easeFactor: 2.5,
        nextReviewDate: new Date(), // due today
        lastReviewDate: new Date(Date.now() - 86400000 * 3),
        stabilityScore: 0.8,
      },
    });
  }

  if (slidingProblem) {
    // Seed Mistake Entry
    const mistake = await prisma.mistakeEntry.upsert({
      where: { id: 'mistake-sw-1' },
      update: {},
      create: {
        id: 'mistake-sw-1',
        userId: user.id,
        problemId: slidingProblem.id,
        category: 'Sliding Window Invariant',
        violatedInvariant: 'Forgot to update the left pointer to max(left, lastSeenIndex + 1) when encountering duplicate character.',
        userNotes: 'When duplicate character occurred outside current left window boundary, window shrank incorrectly.',
        correctiveAction: 'Always enforce window invariant: left pointer can only move strictly forward.',
        severity: Severity.HIGH,
        reviewCount: 3,
      },
    });

    await prisma.revisionItem.upsert({
      where: { id: 'rev-mistake-1' },
      update: { nextReviewDate: new Date() },
      create: {
        id: 'rev-mistake-1',
        userId: user.id,
        itemType: ItemType.MISTAKE_INVARIANT,
        mistakeId: mistake.id,
        repetitionNumber: 1,
        intervalDays: 1,
        easeFactor: 2.3,
        nextReviewDate: new Date(), // due today
        lastReviewDate: new Date(Date.now() - 86400000),
        stabilityScore: 0.6,
      },
    });
  }

  // System Design Concept Revision
  const repConceptId = conceptMap.get('replication-lag-anomalies');
  if (repConceptId) {
    await prisma.revisionItem.upsert({
      where: { id: 'rev-concept-1' },
      update: { nextReviewDate: new Date() },
      create: {
        id: 'rev-concept-1',
        userId: user.id,
        itemType: ItemType.CONCEPT,
        conceptId: repConceptId,
        repetitionNumber: 3,
        intervalDays: 7,
        easeFactor: 2.6,
        nextReviewDate: new Date(), // due today
        lastReviewDate: new Date(Date.now() - 86400000 * 7),
        stabilityScore: 0.85,
      },
    });
  }

  // 7. Seed Initial Architecture Design Whiteboard Artifact
  console.log('🎨 Seeding Sample Architecture Canvas...');
  const design = await prisma.architectureDesign.upsert({
    where: { id: 'arch-url-shortener' },
    update: {},
    create: {
      id: 'arch-url-shortener',
      userId: user.id,
      title: 'Distributed URL Shortener (TinyURL)',
      problemType: 'System Design',
      description: 'High-scale URL shortener handling 100M new URLs/month with sub-10ms read redirects and high availability.',
    },
  });

  await prisma.architectureVersion.upsert({
    where: {
      designId_versionNumber: {
        designId: design.id,
        versionNumber: 1,
      },
    },
    update: {},
    create: {
      designId: design.id,
      versionNumber: 1,
      title: 'Initial Architecture (v1)',
      nodes: [
        { id: 'client-1', type: 'client', label: 'Web/Mobile Client', x: 80, y: 150 },
        { id: 'cdn-1', type: 'cdn', label: 'Cloudflare CDN', x: 280, y: 150 },
        { id: 'lb-1', type: 'load_balancer', label: 'Nginx Load Balancer', x: 480, y: 150 },
        { id: 'app-1', type: 'app_server', label: 'API Application Cluster', x: 680, y: 150 },
        { id: 'cache-1', type: 'cache', label: 'Redis Cache Cluster (LRU)', x: 900, y: 80 },
        { id: 'db-1', type: 'database', label: 'PostgreSQL Primary (Writes)', x: 900, y: 220 },
        { id: 'replica-1', type: 'replica', label: 'PostgreSQL Read Replicas', x: 900, y: 340 },
      ],
      edges: [
        { id: 'e1', from: 'client-1', to: 'cdn-1', protocol: 'HTTPS', isAsync: false },
        { id: 'e2', from: 'cdn-1', to: 'lb-1', protocol: 'HTTPS', isAsync: false },
        { id: 'e3', from: 'lb-1', to: 'app-1', protocol: 'HTTP/2', isAsync: false },
        { id: 'e4', from: 'app-1', to: 'cache-1', protocol: 'TCP/RESP', isAsync: false },
        { id: 'e5', from: 'app-1', to: 'db-1', protocol: 'SQL', isAsync: false },
        { id: 'e6', from: 'db-1', to: 'replica-1', protocol: 'WAL Shipping', isAsync: true },
      ],
      scalabilityScore: 8.5,
      spofsDetected: ['Nginx Load Balancer needs multi-AZ active-passive failover pair via DNS BGP'],
      bottleneckNotes: 'Write path to PostgreSQL primary will become bottleneck at >5k writes/sec; introduce Base62 pre-allocated range token server or Kafka write buffer.',
      latencyTradeoffs: 'Asynchronous WAL shipping to read replicas risks read-after-write inconsistency right after shortening a URL.',
      aiReviewSummary: 'Solid clean architecture. Caching 20% hot URLs via Redis handles 80% read redirect traffic. Primary write bottleneck can be scaled with range-based key generation service.',
    },
  });

  // 8. Seed Today's Daily Training Plan
  console.log('📅 Generating Today Daily Training Plan...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyPlan.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: today,
      },
    },
    update: {},
    create: {
      userId: user.id,
      date: today,
      targetMinutes: 30,
      priorityActions: [
        {
          id: 'act-1',
          type: 'SYSTEM_DESIGN_LESSON',
          title: 'DDIA Ch 5: Replication Lag Anomalies',
          durationMin: 12,
          slug: 'replication-lag-anomalies',
          reason: 'Scheduled based on curriculum progression; core distributed data foundation.',
        },
        {
          id: 'act-2',
          type: 'DSA_PRACTICE',
          title: 'DSA: Two Sum Variations',
          durationMin: 10,
          slug: 'two-sum',
          reason: 'Daily algorithm drill; Level 1 core invariant reinforcement.',
        },
        {
          id: 'act-3',
          type: 'REVISION_DRILL',
          title: 'Active Invariant Recall: Sliding Window Left Pointer',
          durationMin: 5,
          slug: 'longest-substring-without-repeating-characters',
          reason: 'Past high-severity mistake flagged for spaced review today.',
        },
        {
          id: 'act-4',
          type: 'INTERVIEW_DRILL',
          title: '60-Second System Design Pitch: Quorum Consistency',
          durationMin: 3,
          slug: 'dynamo-quorums-version-vectors',
          reason: 'Verbal communication practice for senior/staff interviews.',
        },
      ],
      isCompleted: false,
      totalTimeSpentSec: 0,
    },
  });

  console.log('✅ Seed completed successfully! Database is primed and ready.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
