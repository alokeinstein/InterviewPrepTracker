/**
 * DDIA System Design Academy Content Enhancer
 * Physics Wallah / NCERT style intuitive breakdowns, plain English analogies,
 * active recall questions, and high-yield interview revision cheat sheets for ALL 11 DDIA chapters.
 * Written so that even a complete beginner can understand complex distributed systems concepts.
 */

export interface SectionEnhancement {
  sectionNumber: string;
  simpleExplanation: string;
  analogy: string;
  content: string;
  keyQuestions: {
    question: string;
    answer: string;
    tip: string;
  }[];
}

export interface ChapterCheatSheet {
  chapterTitle: string;
  coreDecisions: { decision: string; recommendation: string; tradeOff: string }[];
  interviewPhrasing: { dontSay: string; sayThis: string; why: string }[];
  tradeOffMatrix: { feature: string; optionA: string; optionB: string; verdict: string }[];
  topInterviewQuestions: { question: string; idealAnswerOutline: string[] }[];
}

export const chapterCheatSheets: Record<number, ChapterCheatSheet> = {
  1: {
    chapterTitle: 'Reliable, Scalable, and Maintainable Applications',
    coreDecisions: [
      {
        decision: 'Composite Architecture vs Single Database',
        recommendation: 'Use specialized storage engines (PostgreSQL for transactions, Redis for fast caching, Elasticsearch for search) unified through an application layer or message queue.',
        tradeOff: 'Specialized query speed vs multi-store sync & eventual consistency.',
      },
      {
        decision: 'SLO Tracking: Mean vs Tail Percentiles',
        recommendation: 'Always measure and optimize p95, p99, and p999 response times rather than average.',
        tradeOff: 'p999 optimization requires hedged requests and isolation vs extra hardware cost.',
      },
      {
        decision: 'Social Feed Fan-Out: Write vs Read',
        recommendation: 'Hybrid model: Push on write to Redis mailboxes for regular users; merge on read for high-follower celebrities.',
        tradeOff: 'Write amplification on tweets vs read latency on home feed loading.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'Our API responds in an average of 50ms.',
        sayThis: 'Our API has a median latency of 30ms and a p99 bounded at 120ms with SLA alerts on p99.9 spikes.',
        why: 'Average hides the worst-case experience of high-value active users.',
      },
      {
        dontSay: 'We build systems that never fail.',
        sayThis: 'We build fault-tolerant systems that anticipate component faults and prevent them from cascading into end-user outages.',
        why: 'Shows staff-level awareness of hardware and cloud failure realities.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Timeline Delivery',
        optionA: 'Fan-out on Read (SQL Joins)',
        optionB: 'Fan-out on Write (Redis Mailboxes)',
        verdict: 'Fan-out on write wins for read-heavy feeds (99% reads), but hybrid exception needed for celebrities.',
      },
      {
        feature: 'Tail Latency Mitigation',
        optionA: 'Aggressive Retries',
        optionB: 'Hedged Requests with Jitter',
        verdict: 'Hedged requests send duplicate calls only after p95 threshold, avoiding self-inflicted DDoS.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'How do you handle the celebrity problem in a social feed architecture?',
        idealAnswerOutline: [
          'Distinguish normal users (<10k followers) from celebrities (>1M followers).',
          'For normal users, push-on-write into followers home timeline caches (fast reads).',
          'For celebrities, exempt from write fan-out; maintain a separate celebrity post cache.',
          'When a follower opens their home timeline, fetch their personal mailbox and merge in recent posts from followed celebrities on-the-fly.',
        ],
      },
    ],
  },
  2: {
    chapterTitle: 'Data Models and Query Languages',
    coreDecisions: [
      {
        decision: 'Relational vs Document vs Graph',
        recommendation: 'Relational when joins and ACID are central; Document for self-contained 1-to-many trees; Graph when many-to-many relationships are deeply interconnected.',
        tradeOff: 'Data locality for single documents vs join complexity and consistency across multiple documents.',
      },
      {
        decision: 'Schema-on-Read vs Schema-on-Write',
        recommendation: 'Schema-on-write for core transactional entities; Schema-on-read for heterogeneous external logs and event payloads.',
        tradeOff: 'Database-enforced integrity vs flexible, zero-downtime evolution for unstructured data.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'NoSQL is always faster than SQL because it has no schema.',
        sayThis: 'Document databases optimize for data locality when accessing single hierarchical records, but become inefficient when querying many-to-many relationships requiring application-level joins.',
        why: 'Demonstrates deep understanding of storage locality vs relational normalization.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Query Paradigm',
        optionA: 'Declarative (SQL/Cypher)',
        optionB: 'Imperative (CODASYL/Code loops)',
        verdict: 'Declarative lets database query optimizer select indexing and join order automatically.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'When would you choose a Document store like MongoDB over PostgreSQL?',
        idealAnswerOutline: [
          'Choose Document store when data has document locality (1-to-many tree where entire document is loaded together).',
          'Choose PostgreSQL when records have many-to-many relationships, need cross-table joins, or require strict multi-row transactions.',
          'Note that modern PostgreSQL supports JSONB with indexing, often giving the best of both worlds.',
        ],
      },
    ],
  },
  3: {
    chapterTitle: 'Storage and Retrieval',
    coreDecisions: [
      {
        decision: 'LSM-Trees (SSTables) vs B-Trees',
        recommendation: 'LSM-trees (RocksDB/Cassandra) for write-heavy workloads; B-trees (PostgreSQL/MySQL) for read-heavy workloads with predictable latency.',
        tradeOff: 'LSM-trees provide sequential write throughput but incur compaction background I/O; B-trees incur random write overhead.',
      },
      {
        decision: 'OLTP vs OLAP Storage Engine',
        recommendation: 'Row-oriented for OLTP (small transactional reads/writes); Column-oriented (ClickHouse/BigQuery) for analytical aggregations over billions of rows.',
        tradeOff: 'Row updates are atomic and fast; Column scans are 10-100x faster for aggregate queries (SUM, AVG).',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'Databases use indexes to make everything fast.',
        sayThis: 'Secondary indexes accelerate read lookups but impose write amplification because every write must update the base table and all corresponding index structures.',
        why: 'Recognizes the write amplification penalty of indexes.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Primary Index Type',
        optionA: 'B-Tree (Pages on disk)',
        optionB: 'LSM-Tree (Memtable + SSTables)',
        verdict: 'B-Tree is default for RDBMS; LSM-Tree is optimal for high write throughput and append-only logs.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'How does an LSM-tree achieve high write throughput compared to a B-tree?',
        idealAnswerOutline: [
          'Writes first append sequentially to an in-memory balanced tree (Memtable) and a write-ahead log (WAL).',
          'Sequential writes to disk are 100x faster than random disk page updates.',
          'When Memtable exceeds a threshold, it flushes to disk as an immutable sorted string table (SSTable).',
          'A background compaction process merges sorted SSTables in the background (like merge sort).',
        ],
      },
    ],
  },
  4: {
    chapterTitle: 'Encoding and Evolution',
    coreDecisions: [
      {
        decision: 'Text Formats (JSON/XML) vs Binary Encoding (Protobuf/Avro)',
        recommendation: 'JSON for public HTTP APIs; Protobuf or Avro for internal microservice RPC and streaming data pipelines.',
        tradeOff: 'Human readability vs 5-10x smaller payload size, fast serialization, and strict schema evolution.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'We use JSON everywhere because it is universal.',
        sayThis: 'For internal high-throughput service communication, we use Protocol Buffers with field tags to guarantee backward and forward compatibility while reducing serialization CPU overhead.',
        why: 'Shows awareness of network efficiency and evolutionary schema contracts.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Serialization',
        optionA: 'JSON / REST',
        optionB: 'gRPC / Protocol Buffers',
        verdict: 'gRPC/Protobuf provides code generation, type safety, binary packing, and HTTP/2 multiplexing.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'How do Protocol Buffers ensure backward and forward compatibility during rolling deployments?',
        idealAnswerOutline: [
          'Fields are identified by integer tag numbers, not by field names.',
          'New code reading old messages: skips missing fields or assigns default values (backward compatibility).',
          'Old code reading new messages: ignores unrecognized tag numbers without throwing errors (forward compatibility).',
          'Rule: Never change existing tag numbers; only add new optional fields.',
        ],
      },
    ],
  },
  5: {
    chapterTitle: 'Replication',
    coreDecisions: [
      {
        decision: 'Replication Topology: Single-Leader vs Multi-Leader vs Leaderless',
        recommendation: 'Single-leader for strict transactional consistency; Leaderless (Dynamo/Cassandra) when writes must never be rejected despite multi-datacenter network partitions.',
        tradeOff: 'Write bottleneck at single leader vs complex conflict resolution (CRDTs, vector clocks).',
      },
      {
        decision: 'Sync vs Async Replication',
        recommendation: 'Semi-synchronous: exactly one synchronous replica for durability, remaining replicas asynchronous for write throughput.',
        tradeOff: 'Write latency vs risk of data loss on ungraceful failover.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'Replication ensures our data is completely consistent.',
        sayThis: 'Asynchronous replication introduces replication lag anomalies such as read-after-write violations and monotonic read regressions; we mitigate these using session sticky routing or version tracking.',
        why: 'Demonstrates deep comprehension of distributed timing realities.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Replication Topology',
        optionA: 'Single-Leader (Postgres/MySQL)',
        optionB: 'Leaderless / Quorum (Cassandra/Dynamo)',
        verdict: 'Single-leader when transactions and ACID matter; Dynamo when writes must never be rejected despite network partitions.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'A user updates their profile picture, refreshes the page, and sees their old picture. What happened and how do you fix it?',
        idealAnswerOutline: [
          'Root cause: Read-after-write inconsistency due to asynchronous replication lag between leader and read replica.',
          'Fix 1: Read user-modifiable resources directly from leader for 60 seconds after an update.',
          'Fix 2: Track client update timestamp and only route reads to replicas whose replication log position exceeds that timestamp.',
          'Fix 3: Session stickiness pinning the user to a replica caught up with their session.',
        ],
      },
    ],
  },
  6: {
    chapterTitle: 'Partitioning (Sharding)',
    coreDecisions: [
      {
        decision: 'Key Range vs Hash Partitioning',
        recommendation: 'Hash partitioning (Consistent Hashing) to evenly distribute writes; Key-range partitioning only when efficient range scans (e.g., date ranges) are essential.',
        tradeOff: 'Hotspot prevention vs efficient cross-partition range queries.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'We shard the database by user ID with modulo N.',
        sayThis: 'We use Consistent Hashing with virtual nodes so adding or removing database nodes only migrates a fraction of data (K/N) without a full rebalance.',
        why: 'Modulo hashing breaks completely when node count changes.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Partitioning Strategy',
        optionA: 'Key-Range Partitioning',
        optionB: 'Hash-based Partitioning',
        verdict: 'Hash-based prevents write hotspots (e.g. today date receiving all writes); Key-range enables fast sequential range queries.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'How do you handle a hot key (e.g. celebrity account) causing a partition hotspot?',
        idealAnswerOutline: [
          'If a single key receives 100x average traffic, consistent hashing alone cannot balance it.',
          'Solution: Add a random 2-digit suffix (key_00 to key_99) to hot keys to spread writes across 100 partitions.',
          'Reads must query all 100 partitions in parallel and merge results.',
        ],
      },
    ],
  },
  7: {
    chapterTitle: 'Transactions',
    coreDecisions: [
      {
        decision: 'Isolation Level: Read Committed vs Snapshot Isolation vs Serializability',
        recommendation: 'Snapshot Isolation (MVCC) for high read concurrency; Serializable Snapshot Isolation (SSI) for financial/booking transactions.',
        tradeOff: 'Read throughput vs vulnerability to Write Skew & Phantom updates.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'ACID transactions prevent all race conditions.',
        sayThis: 'Standard Snapshot Isolation eliminates dirty reads and non-repeatable reads, but still permits write skew and phantom updates. True serializability or explicit pessimistic locks are required.',
        why: 'Staff engineers know that default database transaction levels do NOT prevent write skew.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Concurrency Control',
        optionA: 'Two-Phase Locking (2PL)',
        optionB: 'Serializable Snapshot Isolation (SSI)',
        verdict: 'SSI provides optimistic non-blocking reads with transaction abort on write conflicts; 2PL incurs severe lock contention on hot rows.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'Explain Write Skew with a real-world doctor on-call scenario.',
        idealAnswerOutline: [
          'Rule: At least 1 doctor must be on-call. Two doctors Alice and Bob are currently on call.',
          'Both simultaneously click "take leave". Both transactions read: 2 doctors on call (valid to leave).',
          'Both transactions commit. Result: 0 doctors on call. Invariant violated!',
          'Why snapshot isolation fails: Neither modified the other doctor row, so no row-level write-write lock was triggered.',
          'Solution: `SELECT ... FOR UPDATE` (pessimistic lock) or SSI (aborts on serialization conflict).',
        ],
      },
    ],
  },
  8: {
    chapterTitle: 'The Trouble with Distributed Systems',
    coreDecisions: [
      {
        decision: 'Handling Unreliable Clocks in Distributed Systems',
        recommendation: 'Never use physical wall-clock time (`Date.now()`) for ordering events or consensus; use logical clocks (Lamport/Vector clocks) or TrueTime with bounded uncertainty intervals.',
        tradeOff: 'Simplicity vs silent data corruption and clock drift (NTP jumps).',
      },
      {
        decision: 'Process Pauses & Garbage Collection',
        recommendation: 'Protect distributed lock leases with monotonic fencing tokens checked by storage nodes.',
        tradeOff: 'Lightweight leases vs split-brain writes during GC freeze.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'We use timestamps from the servers to order transactions.',
        sayThis: 'Physical clocks drift and NTP adjustments can step backwards. We use logical sequence numbers or fencing tokens to guarantee order without relying on synchronized physical clocks.',
        why: 'Demonstrates awareness of clock drift and leap-second hazards.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Event Ordering',
        optionA: 'NTP Physical Clock',
        optionB: 'Logical Clocks (Lamport / TrueTime)',
        verdict: 'Physical clocks cannot guarantee total order across nodes; Lamport clocks or Google TrueTime intervals are required.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'What is a fencing token, and why is a distributed lock lease not sufficient by itself?',
        idealAnswerOutline: [
          'Client 1 acquires a lock lease for 10 seconds, but experiences a 15-second GC pause.',
          'The lease expires; Client 2 acquires the lock and writes to storage.',
          'Client 1 wakes up from GC pause, believes it still holds the lock, and writes stale data (split-brain).',
          'Solution: Fencing token. Lock server returns a monotonically increasing number (e.g. token 33, 34). Storage rejects any write with a token lower than the highest seen.',
        ],
      },
    ],
  },
  9: {
    chapterTitle: 'Consistency and Consensus',
    coreDecisions: [
      {
        decision: 'Linearizability vs Serializability',
        recommendation: 'Linearizability guarantees real-time recency on single objects; Serializability guarantees multi-operation transaction isolation. Use both (Strict Serializability) only when necessary.',
        tradeOff: 'Coordination latency (cross-DC roundtrips) vs stale reads and isolation anomalies.',
      },
      {
        decision: 'Distributed Transactions: 2PC vs Consensus Protocol (Raft/Paxos)',
        recommendation: 'Avoid blocking Two-Phase Commit (2PC); use non-blocking consensus algorithms (Raft, Multi-Paxos) with quorum majorities.',
        tradeOff: '2PC coordinator crash blocks all participants; Raft continues smoothly as long as a majority of nodes are alive.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'Consensus means all nodes in the cluster agree on everything.',
        sayThis: 'Consensus protocols like Raft allow a group of nodes to agree on a sequence of state transitions as long as a quorum majority (N/2 + 1) is healthy, tolerating minority node failures.',
        why: 'Reflects accurate mathematical definition of quorum consensus.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Distributed Agreement',
        optionA: 'Two-Phase Commit (2PC)',
        optionB: 'Consensus Protocol (Raft/Paxos)',
        verdict: '2PC is blocking and fails if coordinator dies; Raft is non-blocking with automatic leader election.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'Why is Two-Phase Commit (2PC) considered an anti-pattern in high-availability cloud systems?',
        idealAnswerOutline: [
          'In Phase 1, the coordinator asks participants to prepare to commit. Participants lock resources and vote YES.',
          'If the coordinator crashes before sending Phase 2 COMMIT, participants remain in doubt and must hold locks indefinitely.',
          '2PC reduces availability: all nodes must be healthy for the transaction to succeed. If one node is down, the entire transaction aborts.',
        ],
      },
    ],
  },
  10: {
    chapterTitle: 'Batch Processing',
    coreDecisions: [
      {
        decision: 'MapReduce vs Dataflow Engines (Spark/Flink)',
        recommendation: 'Modern pipelines use Spark/Flink for in-memory intermediate pipelines rather than writing every step to HDFS disk.',
        tradeOff: 'Spark memory usage vs MapReduce high disk I/O and latency.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'MapReduce is just for counting words.',
        sayThis: 'The core power of MapReduce and batch processing is deterministic reproducibility and fault tolerance: if a worker fails, its partition can be recomputed from immutable inputs without side effects.',
        why: 'Highlights functional programming principles behind big data systems.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Batch Engine',
        optionA: 'Hadoop MapReduce',
        optionB: 'Apache Spark',
        verdict: 'Spark keeps intermediate state in memory, running 10-100x faster than MapReduce which writes to disk after every stage.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'How do you handle data skew (hot keys) during a distributed batch join?',
        idealAnswerOutline: [
          'If one key has 10 million rows, a standard hash-partition join sends all 10M rows to a single reducer node (straggler problem).',
          'Solution: Broadcast join (if one table is small enough to fit in memory on every worker).',
          'Skewed join optimization: Replicate the hot key across multiple partitions with random salt, and broadcast the matching side.',
        ],
      },
    ],
  },
  11: {
    chapterTitle: 'Stream Processing',
    coreDecisions: [
      {
        decision: 'AMQP Message Queues (RabbitMQ) vs Log-based Brokers (Kafka)',
        recommendation: 'RabbitMQ for task worker distribution where messages are acknowledged and deleted; Kafka for replayable event streaming, event sourcing, and high-throughput pipelines.',
        tradeOff: 'Individual message ack flexibility vs sequential disk throughput and consumer replayability.',
      },
      {
        decision: 'Dual Writes vs Change Data Capture (CDC)',
        recommendation: 'Never do dual writes in application code (writing to Postgres and Elasticsearch simultaneously); use CDC (Debezium/Kafka) from the database transaction log.',
        tradeOff: 'CDC requires streaming infrastructure but completely prevents data drift and silent desync.',
      },
    ],
    interviewPhrasing: [
      {
        dontSay: 'Our backend updates the database and then sends an update to the search index.',
        sayThis: 'Dual writes risk silent inconsistency if one write fails or network race conditions reverse event order. We use Change Data Capture (CDC) from the database WAL into Kafka to guarantee eventual consistency.',
        why: 'Staff engineers know dual writes are an architectural hazard in production.',
      },
    ],
    tradeOffMatrix: [
      {
        feature: 'Messaging Model',
        optionA: 'JMS / RabbitMQ',
        optionB: 'Kafka Log Partitioning',
        verdict: 'Kafka allows multiple independent consumer groups to read and replay the same event stream at their own pace without deleting messages.',
      },
    ],
    topInterviewQuestions: [
      {
        question: 'Why are application-level dual writes considered dangerous, and how does Change Data Capture (CDC) solve it?',
        idealAnswerOutline: [
          'Hazard 1: Fault tolerance failure. App writes to DB (succeeds), then network fails before writing to Redis/Elasticsearch. Stores are now permanently out of sync.',
          'Hazard 2: Race condition. Client A writes X=1, Client B writes X=2. Network delays cause DB to see A then B (X=2), but Search Index sees B then A (X=1). Invisible data corruption!',
          'CDC Solution: The database transaction log (WAL) is the single source of truth. Debezium streams WAL changes into Kafka in exact commit order, updating secondary stores reliably.',
        ],
      },
    ],
  },
};

export function getSectionEnhancement(
  chapterNum: number,
  sectionNum: string,
  sectionTitle: string
): SectionEnhancement {
  // Section 1.1
  if (chapterNum === 1 && sectionNum === '1.1') {
    return {
      sectionNumber: '1.1',
      simpleExplanation: `In simple words: There is no single "magic database" that is the best at everything. If you try to make PostgreSQL do full-text search, ultra-fast caching, and analytics simultaneously, it will slow down. 

Modern architectures treat different tools like specialized workers:
- **PostgreSQL/MySQL**: The trustworthy bookkeeper (keeps master records safe with ACID transactions).
- **Redis/Memcached**: The fast scratchpad (answers frequent queries in <1 millisecond from RAM).
- **Elasticsearch**: The search librarian (finds keywords and typos instantly using inverted indexes).
- **Kafka**: The courier conveyor belt (passes events between all these systems without dropping anything).`,
      analogy: 'Building a system is like opening a restaurant: you don’t hire one person to cook, take orders, wash dishes, and do the taxes. You hire specialized staff who communicate via order slips.',
      content: `A data-intensive application is typically built from standard building blocks:
- **Databases**: Store data so that they can be found again later.
- **Caches**: Remember the result of an expensive operation to speed up reads.
- **Search Indexes**: Allow users to search data by keyword or filter it in various ways.
- **Stream Processing**: Send a message to another process to be handled asynchronously.

When combining several tools to provide a service, the service API usually hides those implementation details from clients. You have essentially created a new, specialized composite data system from smaller, general-purpose components.`,
      keyQuestions: [
        {
          question: 'Why not just use a single database for all read, write, cache, and search workloads?',
          answer: 'Specialized workloads have contradictory access patterns. Caches prioritize RAM and sub-millisecond retrieval; search engines need inverted indexes and tokenization; relational databases prioritize ACID transactions and durability. Combining them into one system causes resource contention and poor performance across all dimensions.',
          tip: 'In system design interviews, always justify introducing Redis or Elasticsearch by explicitly stating the query access pattern and SLA requirements.',
        },
      ],
    };
  }

  // Section 1.2
  if (chapterNum === 1 && sectionNum === '1.2') {
    return {
      sectionNumber: '1.2',
      simpleExplanation: `In simple words: A **fault** is a single lightbulb burning out. A **failure** is the entire house going dark.

In big cloud companies with 50,000 servers, something is ALWAYS breaking:
- A hard drive dies every few minutes.
- A network cable is unplugged by mistake.
- A server overheats.

Your job as an engineer is to write software so that when a machine catches fire, users never notice. We do this by having backups on standby (redundancy) and testing our resilience by intentionally breaking things in staging (Chaos Engineering).`,
      analogy: 'A twin-engine airplane can safely fly and land even if one engine fails mid-flight.',
      content: `The components of a system can fail in many different ways. It is useful to distinguish between a fault and a failure:
- A **fault** is defined as one component of the system deviating from its spec.
- A **failure** is when the system as a whole stops providing the required service to the user.

It is impossible to reduce the probability of a fault to zero; therefore, it is usually best to design fault-tolerance mechanisms that prevent faults from causing failures.`,
      keyQuestions: [
        {
          question: 'What is the difference between a fault and a failure in distributed systems?',
          answer: 'A fault is an internal component failure (e.g., one server disk crashes). A failure is an external outage where the overall system fails to fulfill its contract to the user. Fault-tolerant systems prevent internal faults from escalating into total failures.',
          tip: 'Mention Netflix Chaos Monkey as an example of intentionally injecting faults in production to verify fault tolerance.',
        },
      ],
    };
  }

  // Section 1.3
  if (chapterNum === 1 && sectionNum === '1.3') {
    return {
      sectionNumber: '1.3',
      simpleExplanation: `In simple words: Scalability is not a one-size-fits-all sticker. It depends entirely on what kind of load is growing.

Look at Twitter:
- Posting a tweet is easy: 12,000 tweets per second.
- Reading home timelines is huge: 300,000 requests per second!
- The catch? When someone like Elon Musk tweets to 150 million followers, delivering that single tweet to 150 million inboxes takes immense CPU and network bandwidth (Write Fan-out).

Also, **never trust average response time**! If an average is 50ms, that could mean 90% of people get 10ms, but 10% of users wait 4 seconds. The users waiting 4 seconds are usually your biggest spenders making large requests. Measure **p99**!`,
      analogy: 'Imagine a postal carrier delivering mail: delivering 10 letters to 10 houses is easy. Delivering 10 million letters from one sender to an entire nation in 5 seconds requires a completely different logistics infrastructure.',
      content: `Scalability is the term we use to describe a systems ability to cope with increased load. But questions like "System A is scalable" are meaningless; instead, we discuss:
- "If the system grows in a particular way, what are our options for coping with the growth?"
- "How can we add computing resources to handle the additional load?"

Load parameters quantify the load: requests per second to a web server, read-to-write ratio in a database, active users in a chat room, or the cache hit rate.`,
      keyQuestions: [
        {
          question: 'Why is the average (mean) latency a misleading metric for web systems?',
          answer: 'Averages hide tail latency. High-percentile users (p95, p99, p999) are often power users with large data footprints (e.g., active shopping carts, large document histories). If their latency degrades, revenue is impacted. Furthermore, in microservices, tail latency compounds exponentially across parallel RPC calls.',
          tip: 'State that high-percentile latency (p99) represents the actual SLA/SLO contract with customers.',
        },
      ],
    };
  }

  // Section 5.1
  if (chapterNum === 5 && sectionNum.startsWith('5.1')) {
    return {
      sectionNumber: sectionNum,
      simpleExplanation: `In simple words: **Leaders and Followers**.
All writes go to ONE leader node. The leader records the change and passes the update to followers (read replicas).
- Reads can go to any follower (great for scaling read traffic!).
- But what if the leader crashes? The followers must elect a new leader (Failover).
- If replication is asynchronous, the new leader might not have the latest writes. If the old leader comes back, it might think it's still the boss (**Split-brain**).`,
      analogy: 'A teacher writing notes on a whiteboard: the teacher writes, and 30 students in the class copy down the notes. Students can answer questions from their notebooks, but only the teacher can add new notes.',
      content: `Replication means keeping a copy of the same data on multiple machines that are connected via a network.
Why replicate?
1. To keep data geographically close to users (reducing latency).
2. To allow the system to continue working even if some parts have failed (high availability).
3. To scale out the number of machines that can serve read queries (increasing read throughput).

In leader-based replication (active/passive or master/slave):
- One replica is designated as the leader. All writes must be sent to the leader.
- The leader sends data changes to all its followers as part of a replication log or change stream.
- Clients can query either the leader or any follower for reads.`,
      keyQuestions: [
        {
          question: 'What is split-brain in leader failover, and why is it dangerous?',
          answer: 'Split-brain occurs when two nodes both believe they are the designated leader. Both accept writes, and since there is no coordination between them, data will conflict and diverge, leading to silent data corruption or loss.',
          tip: 'Fencing tokens or node stonith (Shoot The Other Node In The Head) are standard mitigations.',
        },
      ],
    };
  }

  // Section 5.2
  if (chapterNum === 5 && sectionNum.startsWith('5.2')) {
    return {
      sectionNumber: sectionNum,
      simpleExplanation: `In simple words: **Replication Lag Anomalies**.
Because sending updates over the network takes time, followers can be a few seconds behind the leader.
This creates 3 classic user-visible bugs:
1. **Read-after-write inconsistency**: You post a comment, refresh the page, and your comment vanishes! (Because your read went to a replica that hasn't received your write yet).
2. **Monotonic reads (time travel)**: You refresh once, see a comment. You refresh again, and it disappears! (First read hit an up-to-date replica; second read hit a lagging replica).
3. **Consistent prefix reads**: An answer appears before the question! (Events arrive out of chronological order).`,
      analogy: 'Watching a live football match stream with a friend: your friend is on cable TV (0s lag), you are on internet streaming (15s lag). Your friend screams "GOAL!" 15 seconds before you see the ball kick.',
      content: `If an application reads from an asynchronous follower, it may see out-of-date information if the follower has fallen behind. This leads to apparent inconsistencies in the database.
If you stop writing to the database and wait a while, the followers will eventually catch up and become consistent with the leader. For that reason, this effect is known as **eventual consistency**.

However, the delay between a write happening on the leader and being reflected on a follower—the replication lag—may be a fraction of a second, or several seconds or minutes under high load or network problems.`,
      keyQuestions: [
        {
          question: 'How do you guarantee read-after-write consistency in a leader-follower architecture?',
          answer: 'Route all reads of data that the user may have modified directly to the leader (e.g. user profile data). For other resources, track the timestamp of the users last update and only route reads to replicas whose replication log offset is at least that recent.',
          tip: 'Mention that pinning a user session to the leader for 60 seconds after a write is a pragmatic industry solution.',
        },
      ],
    };
  }

  // Section 7.1 / 7.2
  if (chapterNum === 7) {
    return {
      sectionNumber: sectionNum,
      simpleExplanation: `In simple words: **Transactions & Concurrency**.
A transaction groups multiple database operations into an all-or-nothing package (Atomicity).
If your power cuts out halfway through transferring $100 from Account A to Account B, either BOTH happen or NEITHER happens.

The tricky part is **Isolation**: what happens when 1,000 users try to book the same flight seat at the exact same millisecond?
- Default database isolation (Read Committed / Snapshot Isolation) prevents dirty reads.
- BUT it does NOT prevent **Write Skew**: two doctors on call both check the schedule, see 2 doctors active, and both click "take leave" simultaneously. Result: 0 doctors on call!`,
      analogy: 'Two people trying to enter a single-person fitting room at the same time: without a lock on the door, both walk in simultaneously and collide.',
      content: `In the harsh reality of data systems, many things can go wrong:
- Database software or hardware may fail at any time.
- The application may crash in the middle of a series of operations.
- Network interruptions can cut off the database from the application.
- Several clients may concurrently write to the database, overwriting each other's changes.

A transaction is a way for an application to group several reads and writes together into a logical unit. Conceptually, all the reads and writes in a transaction are executed as one operation: either the entire transaction succeeds (commit) or it fails (abort, rollback).`,
      keyQuestions: [
        {
          question: 'What is Write Skew, and why does Snapshot Isolation fail to prevent it?',
          answer: 'Write skew occurs when two concurrent transactions read overlapping data sets, evaluate an invariant (e.g. at least 1 doctor on call), and write disjoint records (Doctor A updates row A; Doctor B updates row B). Because the updated rows do not overlap, row-level write locks are not triggered, and both commit, violating the global invariant.',
          tip: 'Solve write skew using explicit `SELECT FOR UPDATE` pessimistic locks or true Serializable Snapshot Isolation (SSI).',
        },
      ],
    };
  }

  // Section 11.1 / 11.2
  if (chapterNum === 11) {
    return {
      sectionNumber: sectionNum,
      simpleExplanation: `In simple words: **Event Streams & Change Data Capture**.
Batch processing (MapReduce) is like doing your laundry once a week. Stream processing (Kafka) is like washing each dish immediately after eating.

**The Golden Rule of Distributed Systems: NEVER DO DUAL WRITES!**
If your web server updates Postgres, and then calls Elasticsearch to update the search index, what happens if the network drops between them?
Postgres has the new data; Elasticsearch has the old data. They are now silently corrupted forever!
Instead: write ONLY to Postgres. Have **Change Data Capture (CDC)** read the Postgres transaction log and pipe events into Kafka. Kafka reliably updates Elasticsearch, Redis, and data warehouses in exact chronological order.`,
      analogy: 'A bank teller writing transactions in the master ledger book. A camera records the teller’s ledger entries and broadcasts them to digital displays across all branch screens in real time.',
      content: `In batch processing, input data is bounded: it has a known, finite size. In reality, a lot of data is continually arriving over time: users make purchases, sensors record temperatures, servers emit log messages.
A stream refers to data that is unbounded: it arrives incrementally over time.

Event-driven architectures decouple producers from consumers using message brokers.
In log-based brokers like Apache Kafka, messages are appended to an immutable, ordered disk log partitioned across nodes. Consumers retain their own read offset, allowing multiple independent systems to replay history without affecting each other.`,
      keyQuestions: [
        {
          question: 'Why is Change Data Capture (CDC) superior to application-level dual writes?',
          answer: 'Dual writes suffer from partial failure (one write succeeds, second fails due to network outage) and race conditions (concurrent updates arrive in opposite orders at the two data stores). CDC reads directly from the database write-ahead log (WAL), ensuring every committed change is reliably propagated in exact order.',
          tip: 'Mention tools like Debezium and Kafka Connect as industry standards for CDC.',
        },
      ],
    };
  }

  // General beginner-friendly fallback for other sections
  return {
    sectionNumber: sectionNum,
    simpleExplanation: `In simple words: Section ${sectionNum} addresses the core engineering challenge of **${sectionTitle}**.

In high-scale distributed systems, every decision comes down to trade-offs:
1. **Speed vs Correctness**: Do you need sub-millisecond responses, or do you need 100% strict consistency?
2. **Read Cost vs Write Cost**: Do you do the heavy lifting when data is saved (e.g. precomputed caches), or when data is requested (e.g. dynamic queries)?
3. **Resilience**: How does the system behave when a network cable is cut or a hard drive crashes?`,
    analogy: `Think of a bank ledger: speed is important, but absolute correctness, crash-resilience, and an audit trail are non-negotiable.`,
    content: `Chapter ${chapterNum}, Section ${sectionNum} examines ${sectionTitle} within Martin Kleppmann's Designing Data-Intensive Applications. 
Systems operating at modern scale must navigate fundamental distributed trade-offs: balancing low-latency local reads against multi-datacenter consistency, ensuring fault containment, and choosing storage formats that align with hardware I/O characteristics.`,
    keyQuestions: [
      {
        question: `What is the primary architectural trade-off introduced in ${sectionTitle}?`,
        answer: `Balancing low operational latency against distributed consistency guarantees. Designers must choose whether to pay latency costs on write (e.g. synchronous replication/locks) or on read (e.g. cross-node queries/merging).`,
        tip: `Always articulate trade-offs in terms of Latency vs Consistency vs Availability (CAP / PACELC).`,
      },
    ],
  };
}
