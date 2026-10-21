// Complete canonical data for 11 DDIA chapters and core concepts

export interface ChapterSeed {
  partNumber: number;
  partTitle: string;
  chapterNumber: number;
  title: string;
  sourcePages: string;
  summary: string;
  learningObjectives: string[];
  sections: {
    sectionNumber: string;
    title: string;
    pageStart: number;
    pageEnd: number;
    concepts: {
      name: string;
      slug: string;
      summary: string;
      whyItMatters: string;
      coreMechanics: string;
      visualType: string;
      scenarioProblem: string;
      interviewPrompt: string;
      tradeoffs: string[];
      technologies: string[];
      sourceRef: string;
    }[];
  }[];
}

export const ddiaChapters: ChapterSeed[] = [
  {
    partNumber: 1,
    partTitle: "Foundations of Data Systems",
    chapterNumber: 1,
    title: "Reliable, Scalable and Maintainable Applications",
    sourcePages: "pp. 1-24",
    summary: "Explores the fundamental qualities of data systems: Reliability (tolerating hardware, software, and human faults), Scalability (quantifying load parameters and tail latency percentiles like p99/p999), and Maintainability (operability, simplicity, and evolvability).",
    learningObjectives: [
      "Distinguish faults from system failures and design resilient architectures",
      "Model system load using concrete parameters (e.g., Twitter timeline fan-out)",
      "Analyze response time distributions, high percentiles (p99/p999), and head-of-line blocking",
      "Apply the core maintainability principles: operability, simplicity, and evolvability"
    ],
    sections: [
      {
        sectionNumber: "1.1",
        title: "Thinking About Data Systems",
        pageStart: 2,
        pageEnd: 4,
        concepts: [
          {
            name: "Composite Data Systems",
            slug: "composite-data-systems",
            summary: "Modern applications stitch together specialized components (databases, caches, search indexes, queues) into a single composite data system behind an application service boundary.",
            whyItMatters: "No single database fits every access pattern; engineers must design coordination logic across disparate stores without leaking complexity.",
            coreMechanics: "The application coordinates writes to primary storage, updates search indexes (e.g. Elasticsearch), and invalidates caches (e.g. Redis).",
            visualType: "composite-system-diagram",
            scenarioProblem: "You are designing an e-commerce platform. Reads require full-text search, writes must be transactional, and inventory lookups must take < 5ms. How do you compose your storage layers?",
            interviewPrompt: "Explain how you combine an RDBMS, Redis cache, and Elasticsearch index to handle high-concurrency item updates without showing stale inventory.",
            tradeoffs: ["Read latency vs Cache invalidation consistency", "Specialized performance vs Sync complexity"],
            technologies: ["PostgreSQL", "Redis", "Elasticsearch", "Kafka"],
            sourceRef: "DDIA Chapter 1, pp. 2-4"
          }
        ]
      },
      {
        sectionNumber: "1.2",
        title: "Reliability & Faults",
        pageStart: 4,
        pageEnd: 8,
        concepts: [
          {
            name: "Faults vs Failures & Chaos Engineering",
            slug: "faults-vs-failures",
            summary: "A fault is one component deviating from specification; a failure is when the entire system ceases serving users. Fault-tolerant systems deliberately anticipate and test faults (e.g. Netflix Chaos Monkey).",
            whyItMatters: "In large deployments (10,000+ disks/nodes), hardware faults are daily occurrences; software must prevent component faults from escalating into total failures.",
            coreMechanics: "Redundancy, sandboxes, circuit breakers, process isolation, and deliberate fault-injection testing.",
            visualType: "fault-containment",
            scenarioProblem: "A background batch job starts consuming 98% CPU on an application node that also handles user checkout requests. How do you prevent a cascading outage?",
            interviewPrompt: "What is the difference between a fault and a failure? How do you prevent a correlated software error like a kernel bug from taking down an entire fleet?",
            tradeoffs: ["Fault prevention vs Fault tolerance cost", "Early fail-fast vs Degraded mode availability"],
            technologies: ["Chaos Monkey", "cgroups", "Linux namespaces", "Envoy"],
            sourceRef: "DDIA Chapter 1, pp. 4-8"
          }
        ]
      },
      {
        sectionNumber: "1.3",
        title: "Scalability & Load Parameters",
        pageStart: 8,
        pageEnd: 16,
        concepts: [
          {
            name: "Describing Load & Twitter Fan-out Case Study",
            slug: "describing-load-twitter-case",
            summary: "Load is characterized by specific parameters (requests/sec, read/write ratio, fan-out). Twitter transitioned from relational joins on read to precomputed home timelines on write, and finally to a hybrid model for celebrities.",
            whyItMatters: "System architecture is defined by the fan-out distribution: handling 12k writes/sec is easy; delivering a celebrity tweet to 30M followers in 5 seconds requires write fan-out exceptions.",
            coreMechanics: "Standard users: fan-out on write into Redis timeline mailboxes. Celebrity users (>1M followers): exempt from write fan-out; their tweets are merged at read time.",
            visualType: "twitter-fanout",
            scenarioProblem: "A celebrity posts a live update with 50 million followers. If you use pure write fan-out, the Redis queue gets saturated. If you use pure read-time fan-out, home feed reads spike to 300k req/sec. How do you design the hybrid?",
            interviewPrompt: "Walk me through how you would architect a social feed system handling high write fan-out with skewed follower counts.",
            tradeoffs: ["Work at write time (fan-out cache) vs Work at read time (on-demand merge)", "Storage amplification vs Query latency"],
            technologies: ["Twitter FlockDB", "Redis", "Memcached", "Finagle"],
            sourceRef: "DDIA Chapter 1, pp. 9-11"
          },
          {
            name: "Tail Latency & High Percentiles (p95, p99, p999)",
            slug: "tail-latency-percentiles",
            summary: "Average (mean) latency is misleading. Percentiles (median/p50, p95, p99, p999) reveal the experience of valuable power users. Tail latency amplifies when multiple backend calls are made in parallel.",
            whyItMatters: "If an end-user request requires 10 parallel backend service calls, even a 1% chance of a slow backend call means ~10% of user requests will experience tail latency.",
            coreMechanics: "Head-of-line blocking, TCP retransmissions, GC pauses, and server rack vibration create tail outliers. Measuring requires client-side instrumentation and histogram algorithms (HdrHistogram, t-digest).",
            visualType: "latency-distribution-graph",
            scenarioProblem: "Your web application makes 15 parallel RPC calls to microservices to construct a dashboard. The p99 of each microservice is 200ms. What percentage of user requests exceed 200ms?",
            interviewPrompt: "Why is mean response time a dangerous metric for SLOs? How does tail latency amplification occur in microservices, and how do you mitigate it?",
            tradeoffs: ["p99 optimization cost vs Diminishing return at p99.99", "Timeout aggressiveness vs Duplicate backend work"],
            technologies: ["HdrHistogram", "t-digest", "Prometheus", "Envoy hedged requests"],
            sourceRef: "DDIA Chapter 1, pp. 11-15"
          }
        ]
      }
    ]
  },
  {
    partNumber: 1,
    partTitle: "Foundations of Data Systems",
    chapterNumber: 2,
    title: "Data Models and Query Languages",
    sourcePages: "pp. 25-66",
    summary: "Analyzes the trade-offs between Relational, Document, and Graph data models. Covers the history of the relational revolution over CODASYL/hierarchical models, schema-on-read vs schema-on-write, and declarative vs imperative query engines.",
    learningObjectives: [
      "Analyze the object-relational impedance mismatch and document data locality",
      "Understand why many-to-many relationships break pure document models",
      "Contrast declarative queries (SQL, CSS) with imperative access paths (CODASYL, JavaScript loops)",
      "Model highly interconnected data with Property Graphs, Cypher, and Datalog"
    ],
    sections: [
      {
        sectionNumber: "2.1",
        title: "Relational Model vs Document Model",
        pageStart: 26,
        pageEnd: 42,
        concepts: [
          {
            name: "Document Locality vs Normalization",
            slug: "document-locality-vs-normalization",
            summary: "Document databases provide storage locality for 1-to-many trees (loading an entire document in one contiguous read), but struggle when many-to-many relationships require joins or denormalization.",
            whyItMatters: "Data naturally becomes more interconnected over time. Denormalization avoids joins but shifts consistency and multi-update overhead into application code.",
            coreMechanics: "Relational shredding splits data into normalized tables with foreign keys. Document databases store self-contained JSON/BSON structures.",
            visualType: "document-tree-vs-relational",
            scenarioProblem: "You are designing a resume profile service. Positions and education are 1-to-many, but companies and schools require independent entity pages, search, and user recommendations. Which model fits best?",
            interviewPrompt: "Compare document databases (MongoDB) with relational databases (PostgreSQL) in terms of data locality, schema evolution, and join complexity.",
            tradeoffs: ["Storage locality for tree reads vs Write amplification on document updates", "Normalized consistency vs Fast single-query fetches"],
            technologies: ["PostgreSQL", "MongoDB", "CouchDB", "Spanner interleaved tables"],
            sourceRef: "DDIA Chapter 2, pp. 26-42"
          },
          {
            name: "Schema-on-Read vs Schema-on-Write",
            slug: "schema-on-read-vs-write",
            summary: "Schema-on-write (relational) enforces constraints at write time, akin to compile-time static type checking. Schema-on-read (document) enforces schema at query time in application code, akin to dynamic typing.",
            whyItMatters: "Schema-on-read is advantageous when data is heterogeneous or format is determined by external systems; schema-on-write guarantees structural integrity.",
            coreMechanics: "Relational migrations use `ALTER TABLE`. Document systems handle field format differences with runtime conditional branches in application code.",
            visualType: "schema-types",
            scenarioProblem: "Your company ingests events from 20 different vendor integrations whose payloads change unpredictably every month. Which schema model minimizes downtime?",
            interviewPrompt: "What is meant by 'schemaless' being a misnomer? How does schema-on-read differ from schema-on-write in production migrations?",
            tradeoffs: ["Fast schema iteration vs Missing guarantees and complex reading code", "Database integrity enforcement vs Migration maintenance"],
            technologies: ["PostgreSQL jsonb", "MongoDB", "MySQL pt-online-schema-change"],
            sourceRef: "DDIA Chapter 2, pp. 39-41"
          }
        ]
      },
      {
        sectionNumber: "2.2",
        title: "Graph-like Data Models",
        pageStart: 48,
        pageEnd: 62,
        concepts: [
          {
            name: "Property Graphs & Cypher",
            slug: "property-graphs-cypher",
            summary: "In a property graph, vertices and edges have arbitrary key-value properties. Edges have directions and labels. Declarative query languages like Cypher express variable-length path traversals concisely.",
            whyItMatters: "Relational databases require clumsy recursive Common Table Expressions (`WITH RECURSIVE`) to traverse multi-hop graphs, whereas Cypher expresses traversals in a few lines.",
            coreMechanics: "Vertices have incoming/outgoing edge lists. Traversal follows pointers without executing table-wide joins.",
            visualType: "graph-node-edge",
            scenarioProblem: "You need to find all people who were born in the United States and currently live in Europe across arbitrary depth regional hierarchies (City -> County -> State -> Country -> Continent). How do Cypher and SQL compare?",
            interviewPrompt: "When is a graph database like Neo4j superior to an RDBMS with foreign keys? How does variable-length path traversal work in Cypher?",
            tradeoffs: ["Arbitrary graph traversal efficiency vs Lack of global relational optimizations", "Flexible schema vs Complex distributed partitioning"],
            technologies: ["Neo4j", "Cypher", "PostgreSQL WITH RECURSIVE", "Datomic Datalog"],
            sourceRef: "DDIA Chapter 2, pp. 49-62"
          }
        ]
      }
    ]
  },
  {
    partNumber: 1,
    partTitle: "Foundations of Data Systems",
    chapterNumber: 3,
    title: "Storage and Retrieval",
    sourcePages: "pp. 67-106",
    summary: "Deep dive into storage engine internals: Log-structured engines (Bitcask, SSTables, LSM-Trees) vs Update-in-place page-oriented engines (B-Trees). Distinguishes OLTP from OLAP data warehousing, star schemas, and columnar storage.",
    learningObjectives: [
      "Understand why append-only sequential writes outperform random disk writes",
      "Analyze LSM-Tree mechanics: Memtables, SSTable compaction/merging, and Bloom filters",
      "Master B-Tree internals: 4KB pages, page splits, Write-Ahead Logs (WAL), and latches",
      "Contrast OLTP row storage with OLAP columnar storage, bitmap indexing, and vectorized execution"
    ],
    sections: [
      {
        sectionNumber: "3.1",
        title: "Log-Structured Storage: SSTables and LSM-Trees",
        pageStart: 68,
        pageEnd: 77,
        concepts: [
          {
            name: "SSTables & LSM-Tree Architecture",
            slug: "sstables-and-lsm-trees",
            summary: "Writes are appended to an in-memory balanced tree (Memtable) and a sequential WAL. When the Memtable reaches threshold (e.g. 4MB), it is flushed to disk as a Sorted String Table (SSTable). Background threads merge and compact SSTable segments using mergesort.",
            whyItMatters: "Turns random writes into sequential writes on disk/SSD, enabling massive write throughput compared to B-Trees.",
            coreMechanics: "Memtable (Red-Black / AVL tree), immutable on-disk SSTables sorted by key, sparse in-memory index, Bloom filters to prevent disk seeks on non-existent keys.",
            visualType: "lsm-tree-diagram",
            scenarioProblem: "Your key-value store experiences 100k random writes/sec. A B-Tree storage engine struggles with random I/O. How does an LSM-Tree eliminate this bottleneck, and what is the trade-off during reads?",
            interviewPrompt: "Explain the architecture of an LSM-Tree from write arrival to compaction. Why are Bloom filters crucial for read performance?",
            tradeoffs: ["High write throughput vs Read amplification (checking multiple SSTables)", "Sequential disk I/O vs Background compaction I/O spikes"],
            technologies: ["LevelDB", "RocksDB", "Apache Cassandra", "HBase"],
            sourceRef: "DDIA Chapter 3, pp. 74-77"
          }
        ]
      },
      {
        sectionNumber: "3.2",
        title: "Page-Oriented Storage: B-Trees",
        pageStart: 77,
        pageEnd: 87,
        concepts: [
          {
            name: "B-Trees, WAL, and Page Splitting",
            slug: "b-trees-and-wal",
            summary: "B-Trees break databases into fixed-size pages (traditionally 4KB) and update pages in place. Page splits keep the tree balanced with $O(\\log n)$ depth. To survive crashes during page writes, a Write-Ahead Log (WAL) records every change before modifying pages.",
            whyItMatters: "B-Trees are the foundational index engine of traditional relational databases, offering predictable single-seek reads and direct transaction lock attachment.",
            coreMechanics: "Root page points to child pages via sorted key ranges; leaf pages contain inline data or heap pointers; WAL provides crash durability; latches protect in-memory pages.",
            visualType: "btree-page-split",
            scenarioProblem: "A B-Tree page is full when a new insert arrives. Describe the exact sequence of page allocation, parent reference updates, and WAL logging required to prevent index corruption if power fails.",
            interviewPrompt: "Compare B-Trees with LSM-Trees. Under what workloads does an LSM-Tree beat a B-Tree, and when does a B-Tree offer more predictable latency?",
            tradeoffs: ["Predictable fast reads vs Write amplification (WAL + Page overwrite)", "In-place updates vs Concurrency latch contention"],
            technologies: ["PostgreSQL", "MySQL InnoDB", "Oracle", "SQLite"],
            sourceRef: "DDIA Chapter 3, pp. 77-85"
          }
        ]
      },
      {
        sectionNumber: "3.3",
        title: "OLTP vs OLAP & Column-Oriented Storage",
        pageStart: 87,
        pageEnd: 100,
        concepts: [
          {
            name: "Columnar Storage, Bitmap Encoding & Vectorized Execution",
            slug: "columnar-storage-and-analytics",
            summary: "OLAP data warehouses scan millions of rows over few columns. Column-oriented storage stores each column in a contiguous sequence of values, enabling extraordinary compression (bitmap encoding, run-length) and SIMD vectorized CPU execution.",
            whyItMatters: "In a 100-column fact table with 10 billion rows, a query calculating average revenue across 2 columns reads only 2% of the data volume on disk.",
            coreMechanics: "Values for each column stored sequentially in identical row order; bitmap indexing per distinct value; bitwise AND/OR operations evaluated directly in L1 cache.",
            visualType: "row-vs-column-layout",
            scenarioProblem: "An analyst runs an aggregate query: `SELECT date, SUM(price) FROM sales GROUP BY date` over 500 million records. How does a columnar store execute this 50x faster than a row store?",
            interviewPrompt: "Explain the difference between star schema fact tables and dimension tables. Why does column compression work so effectively in analytical systems?",
            tradeoffs: ["Blazing analytical scan speed vs Inability to perform efficient in-place single-row writes", "Extreme compression vs Multi-column row reconstruction cost"],
            technologies: ["Apache Parquet", "ClickHouse", "Amazon Redshift", "Google BigQuery", "Snowflake"],
            sourceRef: "DDIA Chapter 3, pp. 93-100"
          }
        ]
      }
    ]
  },
  {
    partNumber: 1,
    partTitle: "Foundations of Data Systems",
    chapterNumber: 4,
    title: "Encoding and Evolution",
    sourcePages: "pp. 107-144",
    summary: "Examines binary encoding formats (Thrift, Protocol Buffers, Avro), schema evolution rules, and how data moves across boundaries (databases, RPC/REST services, asynchronous message brokers).",
    learningObjectives: [
      "Understand why programming language built-in serialization (Java Serializable, Python pickle) is dangerous",
      "Compare field tag encodings (Protobuf/Thrift) with schema-resolution encodings (Avro)",
      "Define backward and forward compatibility rules for schema evolution",
      "Recognize the pitfalls of RPC location transparency versus asynchronous message passing"
    ],
    sections: [
      {
        sectionNumber: "4.1",
        title: "Binary Encoding Formats & Schema Evolution",
        pageStart: 108,
        pageEnd: 124,
        concepts: [
          {
            name: "Protobuf/Thrift Tag Numbers vs Avro Schemas",
            slug: "protobuf-thrift-avro-evolution",
            summary: "Protobuf and Thrift use numeric field tags to identify fields in binary streams, allowing field names to change while preserving wire compatibility. Avro uses no tags; reader's and writer's schemas are matched by field name during decoding.",
            whyItMatters: "Allows rolling software deployments where new and old microservice versions concurrently read and write shared data without breaking.",
            coreMechanics: "Backward compatibility: new code can read old data (new fields must have defaults/be optional). Forward compatibility: old code can read new data (ignores unrecognized field tags).",
            visualType: "binary-encoding-byte-breakdown",
            scenarioProblem: "You deploy a new service version that adds a required field to a Protocol Buffer message. Existing instances of the service crash upon receiving messages from the new version. Why?",
            interviewPrompt: "How do Protocol Buffers and Avro handle backward and forward compatibility during schema changes? Why should a new field never be marked required?",
            tradeoffs: ["Compact binary size vs Inability to read without schema definition", "Tag immutability in Protobuf vs Schema registry requirement in Avro"],
            technologies: ["Protocol Buffers", "gRPC", "Apache Thrift", "Apache Avro", "Confluent Schema Registry"],
            sourceRef: "DDIA Chapter 4, pp. 113-124"
          }
        ]
      },
      {
        sectionNumber: "4.2",
        title: "Modes of Data Flow",
        pageStart: 124,
        pageEnd: 135,
        concepts: [
          {
            name: "Data Flow via Databases, RPC, and Message Brokers",
            slug: "data-flow-modes",
            summary: "Data outlives code: database records written 5 years ago must still be decodable today. RPC creates illusory location transparency that hides network faults. Asynchronous message brokers provide buffering, decoupling, and redelivery.",
            whyItMatters: "Conflating a remote network call with a local function call leads to brittle distributed architectures vulnerable to timeouts and cascading failures.",
            coreMechanics: "Databases: forward compatibility preserves unknown fields during read-modify-write. Message brokers: asynchronous message queues buffer bursts without backpressuring client.",
            visualType: "rpc-vs-messaging",
            scenarioProblem: "A payment microservice communicates with an inventory service via synchronous RPC. During peak traffic, the inventory service experiences a 5-second latency spike, cascading timeouts through checkout. How do you re-architect data flow?",
            interviewPrompt: "Why did Jim Waldo argue that 'location transparency' in RPC is fundamentally flawed? How does asynchronous messaging solve this?",
            tradeoffs: ["Synchronous request/response simplicity vs Latency coupling and failure cascade", "Decoupled async queues vs Eventual consistency and message reordering"],
            technologies: ["REST", "gRPC", "RabbitMQ", "Apache Kafka"],
            sourceRef: "DDIA Chapter 4, pp. 125-135"
          }
        ]
      }
    ]
  },
  {
    partNumber: 2,
    partTitle: "Distributed Data",
    chapterNumber: 5,
    title: "Replication",
    sourcePages: "pp. 145-190",
    summary: "Comprehensive breakdown of leader-based, multi-leader, and leaderless replication. Explores replication lag anomalies (read-your-writes, monotonic reads, consistent prefix reads), failover/split-brain, quorums, and version vectors.",
    learningObjectives: [
      "Master synchronous, asynchronous, and semi-synchronous leader-based replication",
      "Analyze failover dangers: split-brain, out-of-order replication logs, and fencing",
      "Diagnose and solve replication lag anomalies: read-after-write, monotonic reads, consistent prefix reads",
      "Design leaderless systems using Dynamo quorums ($w+r>n$), read repair, hinted handoff, and version vectors"
    ],
    sections: [
      {
        sectionNumber: "5.1",
        title: "Leaders and Followers",
        pageStart: 146,
        pageEnd: 155,
        concepts: [
          {
            name: "Leader Failover & Split-Brain Dangers",
            slug: "leader-failover-split-brain",
            summary: "When a leader dies, failover elects a new leader and redirects writes. In asynchronous replication, unreplicated writes on the old leader are lost or conflicting. If two nodes both believe they are leader, split-brain occurs, leading to silent data corruption.",
            whyItMatters: "Failover is the most dangerous operational event in stateful systems. Without fencing or consensus, two leaders can allocate conflicting IDs (e.g. GitHub MySQL/Redis outage).",
            coreMechanics: "Heartbeat timeouts detect failure; majority consensus elects new leader; fencing tokens (STONITH) ensure former leader cannot process writes upon waking.",
            visualType: "split-brain-diagram",
            scenarioProblem: "Leader A has a 45-second GC pause. Nodes declare A dead, promote Follower B, and accept writes. Leader A wakes up and writes incoming requests to disk. How do you prevent split-brain data corruption?",
            interviewPrompt: "Walk me through how automated failover works in a primary-replica architecture. What is split-brain and how is STONITH or fencing used to prevent it?",
            tradeoffs: ["Short failure timeout (fast recovery) vs Risk of false failovers during transient load spikes", "Asynchronous write throughput vs Data loss on uncoordinated failover"],
            technologies: ["PostgreSQL Streaming Replication", "MySQL GTID", "ZooKeeper", "Pacemaker/STONITH"],
            sourceRef: "DDIA Chapter 5, pp. 150-154"
          }
        ]
      },
      {
        sectionNumber: "5.2",
        title: "Problems With Replication Lag",
        pageStart: 155,
        pageEnd: 161,
        concepts: [
          {
            name: "Replication Lag Anomalies & Guarantees",
            slug: "replication-lag-anomalies",
            summary: "In read-scaled asynchronous architectures, followers lag behind the leader. This introduces three critical anomalies: Read-after-write (user submits comment, reloads, and it disappears), Monotonic reads (user reads from fresh follower, then stale follower, seeing time move backwards), and Consistent prefix reads (causal order of messages is inverted).",
            whyItMatters: "Eventual consistency is a weak guarantee. Applications must enforce targeted guarantees to prevent user-facing bugs without sacrificing read scalability.",
            coreMechanics: "Read-after-write: Route user's own profile reads to leader or check client write timestamp against follower LSN. Monotonic reads: Pin user to a consistent follower via user_id hash. Consistent prefix reads: Ensure causally related writes go to the same partition.",
            visualType: "replication-lag-timeline",
            scenarioProblem: "A user posts a photo update and immediately views their feed, but the photo is missing. 3 seconds later, they refresh and see it. What replication anomaly occurred and how do you resolve it?",
            interviewPrompt: "What are the three classic anomalies caused by replication lag? How do you implement read-your-writes consistency in a system with 10 asynchronous read replicas?",
            tradeoffs: ["Reading from leader (guaranteed consistency) vs Overwhelming leader with read traffic", "Client sticky routing vs Uneven follower load distribution"],
            technologies: ["PostgreSQL Hot Standby", "MySQL Read Replicas", "Redis Sentinel"],
            sourceRef: "DDIA Chapter 5, pp. 155-161"
          }
        ]
      },
      {
        sectionNumber: "5.3",
        title: "Leaderless Replication",
        pageStart: 171,
        pageEnd: 186,
        concepts: [
          {
            name: "Dynamo Quorums ($w + r > n$) & Version Vectors",
            slug: "dynamo-quorums-version-vectors",
            summary: "Leaderless systems (Cassandra, Riak) eliminate failover by allowing writes directly to any replica. Quorum reads ($r$) and writes ($w$) over $n$ replicas guarantee overlap ($w + r > n$). Version vectors track happens-before relationships to detect concurrent write conflicts.",
            whyItMatters: "Provides high write availability across multiple datacenters, but requires application code or CRDTs to resolve conflicting sibling versions.",
            coreMechanics: "Client or coordinator sends writes to all $n$ nodes; returns OK when $w$ acknowledge. Reads query $r$ nodes; version numbers detect stale values, triggering read repair. Sloppy quorums & hinted handoff accept writes on temporary nodes during network partitions.",
            visualType: "quorum-overlap-diagram",
            scenarioProblem: "In a cluster with $n=3, w=2, r=2$, can a client ever read a stale value? Describe the exact network race condition that violates linearizability despite meeting strict quorum condition.",
            interviewPrompt: "Explain how Dynamo-style databases achieve write availability during network partitions. What is the difference between strict quorum and sloppy quorum with hinted handoff?",
            tradeoffs: ["No leader bottleneck vs Weak consistency and conflict resolution complexity", "Last-Write-Wins simplicity vs Silent data loss from clock skew"],
            technologies: ["Apache Cassandra", "Basho Riak", "Amazon Dynamo", "CRDTs"],
            sourceRef: "DDIA Chapter 5, pp. 171-186"
          }
        ]
      }
    ]
  },
  {
    partNumber: 2,
    partTitle: "Distributed Data",
    chapterNumber: 6,
    title: "Partitioning",
    sourcePages: "pp. 191-212",
    summary: "Explains how to partition large datasets (sharding). Compares key-range partitioning (sorted, supports range queries, risks hot spots) with hash-of-key partitioning (uniform, destroys order). Analyzes local vs global secondary indexes and rebalancing strategies.",
    learningObjectives: [
      "Contrast key-range partitioning with hash-based partitioning",
      "Mitigate skewed workloads and celebrity hot spots on specific partition keys",
      "Analyze secondary indexes: Document-partitioned (local/scatter-gather) vs Term-partitioned (global)",
      "Evaluate cluster rebalancing: Why hash mod N fails, fixed partition allocation, and dynamic splitting"
    ],
    sections: [
      {
        sectionNumber: "6.1",
        title: "Partitioning Key-Value Data",
        pageStart: 193,
        pageEnd: 197,
        concepts: [
          {
            name: "Key-Range vs Hash-of-Key & Hot Spot Mitigation",
            slug: "key-range-vs-hash-partitioning",
            summary: "Key-range partitioning assigns continuous key ranges (like an encyclopedia volume), enabling efficient range scans, but risks hot spots if keys are sequential (e.g. timestamps). Hash partitioning uniformly spreads writes, destroying ordering.",
            whyItMatters: "A single celebrity user can overload one partition even with hash partitioning because identical keys produce identical hashes.",
            coreMechanics: "Hash partitioning uses uniform hash functions (MD5, Murmur3). Compound primary keys (Cassandra) hash the partition key for routing while sorting remaining columns locally for range queries.",
            visualType: "partitioning-strategies",
            scenarioProblem: "A sensor network writes 500k readings/sec keyed by timestamp (`YYYY-MM-DD HH:mm:ss`). All writes hit today's partition. How do you redesign the key to distribute writes across 20 nodes while preserving range queries for a given sensor?",
            interviewPrompt: "Explain why hash mod N is disastrous for database rebalancing. How do Cassandra and DynamoDB combine partition keys and clustering keys?",
            tradeoffs: ["Range scan capability (Key-range) vs Uniform write distribution (Hash)", "Celebrity key salting vs Read-time fan-out across salted keys"],
            technologies: ["HBase", "Cassandra compound keys", "MongoDB sharding"],
            sourceRef: "DDIA Chapter 6, pp. 194-197"
          }
        ]
      },
      {
        sectionNumber: "6.2",
        title: "Secondary Indexes and Partitioning",
        pageStart: 197,
        pageEnd: 201,
        concepts: [
          {
            name: "Document (Local) vs Term (Global) Partitioned Indexes",
            slug: "document-vs-term-secondary-indexes",
            summary: "Document-partitioned secondary indexes (local) store index entries on the same partition as the document, requiring scatter-gather queries across all nodes for reads. Term-partitioned indexes (global) partition the index by the indexed term itself, making reads single-node but writes distributed.",
            whyItMatters: "Secondary indexes are essential for user searches but create major architectural trade-offs: cheap writes with slow scatter-gather reads vs fast reads with complex distributed writes.",
            coreMechanics: "Local index: Write hits only 1 partition; read must scatter across all partitions and gather results. Global index: Read queries only the partition matching the term; write must update multiple remote partitions.",
            visualType: "local-vs-global-index-diagram",
            scenarioProblem: "You are building a car marketplace where users filter by `color=red` and `make=Honda`. Compare executing this query under document-partitioned indexes vs global term-partitioned indexes in terms of latency and write overhead.",
            interviewPrompt: "What is scatter-gather query execution in partitioned databases? Why does it amplify tail latency, and when would you choose a global index instead?",
            tradeoffs: ["Local index: Single-partition write vs Scatter-gather read amplification", "Global index: Targeted read vs Distributed transaction on multi-term writes"],
            technologies: ["Elasticsearch", "MongoDB", "DynamoDB Global Secondary Indexes", "Riak Search"],
            sourceRef: "DDIA Chapter 6, pp. 197-201"
          }
        ]
      }
    ]
  },
  {
    partNumber: 2,
    partTitle: "Distributed Data",
    chapterNumber: 7,
    title: "Transactions",
    sourcePages: "pp. 213-264",
    summary: "Demystifies ACID transactions. Contrasts single-object operations with multi-object transactions. Details race conditions under weak isolation (read committed, snapshot isolation/MVCC) and reveals the subtle bugs of write skew and phantoms. Covers serializability via serial execution, 2PL, and SSI.",
    learningObjectives: [
      "Define the true meaning of ACID (Atomicity as abortability, Isolation as serializability)",
      "Identify dirty reads, dirty writes, lost updates, and write skew race conditions",
      "Understand Snapshot Isolation & Multi-Version Concurrency Control (MVCC) in PostgreSQL",
      "Analyze Serializable Snapshot Isolation (SSI) vs Two-Phase Locking (2PL)"
    ],
    sections: [
      {
        sectionNumber: "7.1",
        title: "The Meaning of ACID & Weak Isolation Levels",
        pageStart: 214,
        pageEnd: 233,
        concepts: [
          {
            name: "Snapshot Isolation & MVCC Invariants",
            slug: "snapshot-isolation-mvcc",
            summary: "Snapshot isolation guarantees that readers never block writers and writers never block readers. Each transaction reads from a frozen, consistent snapshot of committed data corresponding to its start timestamp using Multi-Version Concurrency Control (MVCC).",
            whyItMatters: "Eliminates read skew (non-repeatable reads) without holding read locks, making long-running backups and analytics feasible alongside heavy OLTP writes.",
            coreMechanics: "Each transaction gets an increasing transaction ID (`txid`). Rows have `created_by` and `deleted_by` txids. A row is visible if its creating transaction was committed before reader began, and deleting transaction is uncommitted or started after reader.",
            visualType: "mvcc-visibility-diagram",
            scenarioProblem: "Alice transfers $100 from account 1 ($500) to account 2 ($500). During the transfer, an auditor reads account 1 after the deduction ($400) and account 2 before the credit ($500), seeing $900 total. How does snapshot isolation prevent this?",
            interviewPrompt: "Explain how PostgreSQL implements MVCC using `created_by` and `deleted_by` transaction IDs. Why does snapshot isolation prevent dirty reads and read skew?",
            tradeoffs: ["Non-blocking reads vs Storage overhead of multiple tuple versions (vacuuming required)", "Repeatable reads vs Vulnerability to write skew anomalies"],
            technologies: ["PostgreSQL MVCC", "MySQL InnoDB Repeatable Read", "Oracle"],
            sourceRef: "DDIA Chapter 7, pp. 228-233"
          }
        ]
      },
      {
        sectionNumber: "7.2",
        title: "Write Skew and Phantoms",
        pageStart: 237,
        pageEnd: 242,
        concepts: [
          {
            name: "Write Skew & Phantoms",
            slug: "write-skew-and-phantoms",
            summary: "Write skew occurs when two concurrent transactions read the same objects, make decisions based on that premise, and update different objects, violating an application invariant (e.g. two doctors concurrently going off-call). A phantom occurs when a write changes the result of another transaction's search query.",
            whyItMatters: "Neither read committed nor snapshot isolation prevents write skew because the transactions write to distinct rows. Atomic operations and row locks on existing rows cannot lock rows that do not yet exist (phantoms).",
            coreMechanics: "Pattern: SELECT condition $\to$ check result $\to$ INSERT/UPDATE $\to$ COMMIT. Under snapshot isolation, both transactions observe the premise as true. Safe prevention requires true serializability (SSI or 2PL predicate/index-range locks).",
            visualType: "write-skew-doctors",
            scenarioProblem: "A hospital rule requires at least one doctor on call. Alice and Bob are both on call. Both simultaneously request leave. Both transactions check `SELECT count(*) WHERE on_call=true` (returns 2), then set their own status to false. Both commit, leaving zero doctors on call. Why didn't snapshot isolation catch this?",
            interviewPrompt: "What is write skew? How does it differ from a dirty write and a lost update? Why can't row-level locks on existing data prevent phantom-induced write skew?",
            tradeoffs: ["Permissive weak isolation vs Invariant corruption risk", "Manual conflict materialization vs Throughput cost of serializability"],
            technologies: ["PostgreSQL Serializable (SSI)", "Two-Phase Locking (2PL)", "SELECT FOR UPDATE"],
            sourceRef: "DDIA Chapter 7, pp. 237-242"
          }
        ]
      },
      {
        sectionNumber: "7.3",
        title: "Serializability",
        pageStart: 242,
        pageEnd: 257,
        concepts: [
          {
            name: "Actual Serial Execution vs 2PL vs SSI",
            slug: "serializability-mechanisms",
            summary: "Three modern implementations of serializability: 1) Actual serial execution on a single CPU core using stored procedures (VoltDB, Redis); 2) Two-Phase Locking (2PL) where writers block readers and readers block writers; 3) Serializable Snapshot Isolation (SSI) which optimistically tracks read-write conflict tripwires and aborts conflicting commits.",
            whyItMatters: "SSI provides full serializable safety with the performance profile of snapshot isolation, eliminating locks for read-only queries.",
            coreMechanics: "2PL acquires shared/exclusive locks and index-range locks held until commit. SSI tracks when transactions read outdated MVCC versions or when writes affect prior index-range reads, aborting the latter at commit time.",
            visualType: "ssi-tripwire-diagram",
            scenarioProblem: "You have a high-throughput payment processing system with 80% reads and 20% writes. 2PL causes high lock contention and latency spikes. How does SSI maintain serializability without blocking reads?",
            interviewPrompt: "Compare Two-Phase Locking (2PL) with Serializable Snapshot Isolation (SSI). How does SSI detect write skew without pessimistic locks?",
            tradeoffs: ["Pessimistic locking (stable under contention) vs High latency and deadlocks", "Optimistic SSI (fast with low abort rate) vs Heavy abort penalties under high contention"],
            technologies: ["PostgreSQL SSI", "FoundationDB", "VoltDB", "MySQL InnoDB 2PL"],
            sourceRef: "DDIA Chapter 7, pp. 242-257"
          }
        ]
      }
    ]
  },
  {
    partNumber: 2,
    partTitle: "Distributed Data",
    chapterNumber: 8,
    title: "The Trouble with Distributed Systems",
    sourcePages: "pp. 265-310",
    summary: "Exposes the harsh reality of distributed systems: partial failures, unreliable networks (timeouts, unbounded delay, queueing), unreliable clocks (monotonic vs time-of-day, drift, LWW data loss, GC pauses), and the mechanics of truth via majority quorums and fencing tokens.",
    learningObjectives: [
      "Understand why single-node deterministic computing assumptions break in distributed networks",
      "Analyze network unreliability, unbounded delays, and dynamic resource partitioning",
      "Identify catastrophic failures caused by physical clock synchronization and Last-Write-Wins (LWW)",
      "Design safe distributed leases using monotonically increasing fencing tokens (STONITH)"
    ],
    sections: [
      {
        sectionNumber: "8.1",
        title: "Unreliable Clocks & Timestamps",
        pageStart: 278,
        pageEnd: 291,
        concepts: [
          {
            name: "Physical Clocks, Drift & Google TrueTime",
            slug: "unreliable-clocks-truetime",
            summary: "Time-of-day clocks drift unpredictably and can jump backwards via NTP. Last-Write-Wins (LWW) conflict resolution silently drops causally later writes due to clock skew. Google Spanner's TrueTime solves this by exposing clock confidence intervals $[earliest, latest]$ and waiting out the uncertainty interval before committing.",
            whyItMatters: "Physical clock timestamps cannot be trusted for total order causality across nodes unless uncertainty bounds are enforced by hardware (GPS/atomic clocks).",
            coreMechanics: "Quartz crystals drift ~200ppm (17s/day). Monotonic clocks measure elapsed duration on single node. TrueTime guarantees non-overlapping intervals for causally ordered transactions by delaying commit by $\\epsilon$ (~7ms).",
            visualType: "clock-skew-lww-bug",
            scenarioProblem: "Client A writes $x=1$ at node 1 (clock=42.004s). Client B increments $x$ at node 3 (clock=42.003s). Under LWW, which write survives on node 2, and what data was lost?",
            interviewPrompt: "Why is Last-Write-Wins dangerous in distributed databases like Cassandra? How does Google Spanner's TrueTime API use clock uncertainty to guarantee external consistency?",
            tradeoffs: ["Physical clock simplicity vs Silent data loss under clock skew", "TrueTime wait-out latency vs Distributed linearizable transactions"],
            technologies: ["Google Spanner TrueTime", "NTP", "Precision Time Protocol (PTP)", "Cassandra LWW"],
            sourceRef: "DDIA Chapter 8, pp. 278-286"
          }
        ]
      },
      {
        sectionNumber: "8.2",
        title: "Knowledge, Truth and Lies",
        pageStart: 291,
        pageEnd: 302,
        concepts: [
          {
            name: "Fencing Tokens & Process Pauses",
            slug: "fencing-tokens-process-pauses",
            summary: "A node holding a lease can be paused by a stop-the-world garbage collection pause, OS paging, or hypervisor steal time. While paused, its lease expires and another node is elected. When it resumes, it still believes it is the leader unless storage validates a monotonically increasing fencing token.",
            whyItMatters: "Simple lease timeouts are vulnerable to process pauses. Fencing tokens make the storage layer reject writes from stale, zombie leaders.",
            coreMechanics: "Lock service issues monotonically increasing token (e.g. 33, then 34). Storage engine records highest token seen; rejects any write containing token $\\le$ current token.",
            visualType: "fencing-token-diagram",
            scenarioProblem: "Client 1 acquires a 10s lease to write to shared storage, then suffers a 15s stop-the-world GC pause. Client 2 acquires the new lease and writes data. Client 1 wakes up and issues its write. How does a fencing token protect the file?",
            interviewPrompt: "How can a garbage collection pause corrupt data in a distributed locking system? Explain how fencing tokens solve the split-brain lease expiry problem.",
            tradeoffs: ["Storage-level token verification requirement vs Application-level lock trust", "Lock timeout aggressiveness vs False failovers"],
            technologies: ["Apache ZooKeeper zxid", "etcd", "HBase HDFS fencing", "STONITH"],
            sourceRef: "DDIA Chapter 8, pp. 293-295"
          }
        ]
      }
    ]
  },
  {
    partNumber: 2,
    partTitle: "Distributed Data",
    chapterNumber: 9,
    title: "Consistency and Consensus",
    sourcePages: "pp. 311-376",
    summary: "The apex of distributed data theory. Explores linearizability (recency guarantee) vs serializability. Formulates the equivalence between linearizable registers, total order broadcast, and consensus. Details 2-Phase Commit (2PC), FLP impossibility, and consensus algorithms (Paxos, Raft, Zab).",
    learningObjectives: [
      "Define linearizability as a recency guarantee and distinguish it from transaction serializability",
      "Critique the traditional CAP theorem and formulate the true trade-off: Consistency vs Availability under Partition",
      "Understand causality, Lamport timestamps, and why total order broadcast is equivalent to consensus",
      "Analyze Two-Phase Commit (2PC) coordinator failure and compare it to fault-tolerant consensus (Raft/Paxos)"
    ],
    sections: [
      {
        sectionNumber: "9.1",
        title: "Linearizability",
        pageStart: 314,
        pageEnd: 329,
        concepts: [
          {
            name: "Linearizability vs Serializability & CAP Critique",
            slug: "linearizability-vs-serializability",
            summary: "Linearizability is a recency guarantee on single objects (reads return the latest write atomically). Serializability is an isolation guarantee on multi-object transactions. The CAP theorem only applies to linearizability under network partitions; non-linearizable systems can preserve causal consistency without paying the network latency penalty.",
            whyItMatters: "Confusing linearizability with serializability leads to severe design errors. Understanding the latency cost of linearizability allows choosing causal consistency where appropriate.",
            coreMechanics: "Linearizable register: Once any read returns new value, all subsequent reads must return that or newer value. Cost: response time is proportional to network delay uncertainty.",
            visualType: "linearizability-timeline",
            scenarioProblem: "Alice sees the World Cup final score on her phone and tells Bob. Bob refreshes his phone and sees the match still in progress. Why is this a linearizability violation and how does it relate to cross-channel timing dependencies?",
            interviewPrompt: "What is the exact definition of linearizability? How does it differ from serializability? What is 'strict serializability'?",
            tradeoffs: ["Immediate global recency vs High latency and unavailability during partitions", "Causal consistency (fast, available) vs Need for conflict tracking"],
            technologies: ["etcd", "ZooKeeper", "Spanner", "FoundationDB"],
            sourceRef: "DDIA Chapter 9, pp. 314-328"
          }
        ]
      },
      {
        sectionNumber: "9.2",
        title: "Ordering and Total Order Broadcast",
        pageStart: 329,
        pageEnd: 343,
        concepts: [
          {
            name: "Lamport Timestamps vs Total Order Broadcast",
            slug: "lamport-timestamps-total-order-broadcast",
            summary: "Lamport timestamps provide a total order consistent with causality after the fact, but cannot enforce constraints in real time (you cannot know if another node created an earlier operation). Total Order Broadcast guarantees reliable delivery and totally ordered delivery in real time, making it equivalent to consensus.",
            whyItMatters: "Enforcing uniqueness constraints (usernames, bank balances) requires knowing when the operation order is finalized, which requires Total Order Broadcast.",
            coreMechanics: "Total Order Broadcast: 1) Reliable delivery (no messages lost); 2) Totally ordered delivery (all nodes process in identical order). Delivering a message appends to an immutable log.",
            visualType: "total-order-broadcast-diagram",
            scenarioProblem: "Two users concurrently attempt to register the username 'admin'. Why are Lamport timestamps insufficient to decide the winner in real time, and how does Total Order Broadcast solve it?",
            interviewPrompt: "Why are Lamport timestamps inadequate for implementing a uniqueness constraint in a distributed system? What guarantees are provided by Total Order Broadcast?",
            tradeoffs: ["Post-hoc causal order (Lamport) vs Real-time consensus coordination (Total Order Broadcast)", "Throughput scaling vs Single-leader total order sequencing"],
            technologies: ["ZooKeeper Zab", "etcd Raft", "Kafka"],
            sourceRef: "DDIA Chapter 9, pp. 334-343"
          }
        ]
      },
      {
        sectionNumber: "9.3",
        title: "Distributed Transactions & Consensus",
        pageStart: 343,
        pageEnd: 365,
        concepts: [
          {
            name: "Two-Phase Commit (2PC) vs Fault-Tolerant Consensus (Raft)",
            slug: "2pc-vs-consensus-raft",
            summary: "Two-Phase Commit (2PC) is a blocking atomic commit protocol requiring unanimous agreement; if the coordinator crashes after participants vote YES, participants remain in doubt and hold locks indefinitely. Fault-tolerant consensus (Raft, Paxos) requires only a majority quorum ($n/2 + 1$) and guarantees termination even if nodes crash.",
            whyItMatters: "2PC amplifies failure rates across heterogeneous systems, while consensus algorithms maintain progress as long as a majority of nodes remain reachable.",
            coreMechanics: "2PC: Prepare phase (participants write to disk, promise to commit), Commit phase (coordinator writes commit record, sends commit). Raft: Leader election with epoch/term numbers, log replication via majority quorums, state machine replication.",
            visualType: "2pc-vs-raft",
            scenarioProblem: "During a 2PC transaction, database 1 and 2 vote YES. The coordinator commits locally, sends COMMIT to database 2, and immediately crashes before notifying database 1. What state is database 1 in, and why can't it unilaterally abort?",
            interviewPrompt: "Explain the two phases of Two-Phase Commit (2PC). Why is 2PC considered a blocking protocol? How do consensus algorithms like Raft or Paxos overcome this limitation?",
            tradeoffs: ["Unanimous atomic commit (2PC) vs Fragility and lock blocking", "Majority consensus (Raft) vs Requires $2f+1$ nodes to tolerate $f$ failures"],
            technologies: ["Raft", "Paxos", "ZooKeeper Zab", "XA Transactions"],
            sourceRef: "DDIA Chapter 9, pp. 343-365"
          }
        ]
      }
    ]
  },
  {
    partNumber: 3,
    partTitle: "Derived Data",
    chapterNumber: 10,
    title: "Batch Processing",
    sourcePages: "pp. 377-424",
    summary: "Explores batch processing from Unix pipelines to MapReduce, distributed filesystems (HDFS), distributed join algorithms (sort-merge, broadcast hash, partitioned hash), and modern dataflow engines (Spark, Flink).",
    learningObjectives: [
      "Apply the Unix philosophy (uniform interfaces, immutability, composability) to large-scale data systems",
      "Master MapReduce execution: Map, Shuffle/Sort, and Reduce phases",
      "Implement distributed join patterns: Reduce-side sort-merge vs Map-side broadcast hash joins",
      "Analyze dataflow engines (Spark, Flink, Tez) and Bulk Synchronous Parallel (Pregel) graph processing"
    ],
    sections: [
      {
        sectionNumber: "10.1",
        title: "MapReduce and Distributed Joins",
        pageStart: 385,
        pageEnd: 406,
        concepts: [
          {
            name: "Distributed Join Algorithms: Sort-Merge vs Broadcast Hash",
            slug: "distributed-join-algorithms",
            summary: "MapReduce implements joins across petabyte datasets: Reduce-side sort-merge joins bring records with the same join key to the same reducer via the shuffle sort. Map-side broadcast hash joins load small tables into memory on every mapper, eliminating the expensive shuffle stage entirely.",
            whyItMatters: "Choosing the correct distributed join algorithm can reduce job runtime from hours to minutes by avoiding disk spills and network shuffle bottlenecks.",
            coreMechanics: "Reduce-side join: Mappers tag records with key and source; framework sorts; reducer merges. Broadcast hash join: Small dataset broadcast to all mappers; large dataset streamed through in-memory hash table.",
            visualType: "mapreduce-join-diagram",
            scenarioProblem: "You need to join a 10TB user clickstream log with a 100MB user demographics table in Spark. Which join strategy should you configure, and why is an external shuffle unnecessary?",
            interviewPrompt: "Compare reduce-side sort-merge joins with map-side broadcast joins in Hadoop/Spark. How do you handle severe data skew caused by celebrity user IDs?",
            tradeoffs: ["Sort-merge generality vs Network and disk shuffle overhead", "Broadcast join speed vs Memory capacity limits on worker nodes"],
            technologies: ["Apache Spark", "Hadoop MapReduce", "Apache Hive", "Presto/Trino"],
            sourceRef: "DDIA Chapter 10, pp. 391-398"
          }
        ]
      }
    ]
  },
  {
    partNumber: 3,
    partTitle: "Derived Data",
    chapterNumber: 11,
    title: "Stream Processing",
    sourcePages: "pp. 425-470",
    summary: "Analyzes unbounded event streams: AMQP/JMS message brokers vs log-based brokers (Kafka). Details Change Data Capture (CDC), Event Sourcing, the duality between streams and tables, windowing models, and exactly-once processing.",
    learningObjectives: [
      "Distinguish traditional transient message queues from partitioned append-only event logs (Kafka)",
      "Understand the dangers of dual writes and implement Change Data Capture (CDC)",
      "Master the stream-table duality (State is the integral of the stream; change stream is the derivative)",
      "Design tumbling, hopping, sliding, and session windows with event-time vs processing-time semantics"
    ],
    sections: [
      {
        sectionNumber: "11.1",
        title: "Event Streams & Log-Based Brokers",
        pageStart: 426,
        pageEnd: 436,
        concepts: [
          {
            name: "Log-Based Message Brokers (Kafka) vs Traditional JMS/AMQP",
            slug: "log-based-message-brokers",
            summary: "Traditional brokers delete messages upon delivery and load balance by message, risking reordering upon consumer failure. Log-based brokers (Kafka) append events to durable partitioned logs where consumers track their own offsets, enabling multiple independent readers and historic replay.",
            whyItMatters: "Allows streaming pipelines to act like reproducible batch jobs: bugs can be fixed and historical events reprocessed from day zero.",
            coreMechanics: "Append-only commit log on disk; partition assignment to consumer groups; sequential read efficiency; log compaction retains latest value per key.",
            visualType: "kafka-partition-offsets",
            scenarioProblem: "You deploy a buggy event consumer that improperly parses customer payments for 6 hours. With an AMQP broker, processed messages are gone. How does Kafka's consumer offset model enable recovery?",
            interviewPrompt: "How does a log-based message broker like Apache Kafka differ from a traditional message queue like RabbitMQ? How is parallelism achieved without message reordering?",
            tradeoffs: ["Replayable durable log vs Fixed partition concurrency limits", "High-throughput sequential I/O vs Coarse-grained consumer load balancing"],
            technologies: ["Apache Kafka", "RabbitMQ", "Apache Pulsar", "AWS Kinesis"],
            sourceRef: "DDIA Chapter 11, pp. 432-436"
          }
        ]
      },
      {
        sectionNumber: "11.2",
        title: "Databases and Streams",
        pageStart: 436,
        pageEnd: 448,
        concepts: [
          {
            name: "Dual Writes Race Conditions vs Change Data Capture (CDC)",
            slug: "dual-writes-vs-cdc",
            summary: "Dual writes (application writing to DB and search index simultaneously) suffer from unavoidable race conditions and out-of-sync partial failures. Change Data Capture (CDC) extracts the database's write-ahead replication log into a stream, ensuring all derived stores update in strict linear order.",
            whyItMatters: "CDC guarantees that caches, search indexes, and data warehouses remain consistent with the database of record without distributed transactions.",
            coreMechanics: "Leader database writes to WAL; CDC engine (Debezium) tails WAL and publishes change events to Kafka; consumers update Elasticsearch and Redis.",
            visualType: "dual-writes-interleaving",
            scenarioProblem: "Client 1 sets $X=A$ and Client 2 sets $X=B$. Under dual writes, the DB receives $A$ then $B$, but Elasticsearch receives $B$ then $A$. What is the result, and how does CDC prevent this race condition?",
            interviewPrompt: "Why are dual writes considered an anti-pattern in distributed systems? How does Change Data Capture (CDC) preserve consistency across derived data systems?",
            tradeoffs: ["CDC consistency guarantee vs Asynchronous replication lag on derived read views", "WAL decoding complexity vs Application dual-write simplicity"],
            technologies: ["Debezium", "PostgreSQL logical decoding", "Kafka Connect", "AWS DynamoDB Streams"],
            sourceRef: "DDIA Chapter 11, pp. 437-442"
          },
          {
            name: "Stream-Table Duality & Event Sourcing (CQRS)",
            slug: "stream-table-duality-event-sourcing",
            summary: "A table stores current state; a stream stores history of change. Mathematically, $\\text{State}(now) = \\int_0^{now} \\text{Stream}(t)\\,dt$, and $\\text{Stream}(t) = \\frac{d\\,\\text{State}(t)}{dt}$. Event sourcing models application state as an append-only log of domain events, deriving read-optimized views via CQRS.",
            whyItMatters: "Separates write optimization (fast appends to immutable event log) from read optimization (denormalized, task-specific query views), avoiding the fallacy that data must be written in the form it is queried.",
            coreMechanics: "Commands are validated synchronously before turning into immutable events. Projectors consume the event log to build materialized tables in read databases.",
            visualType: "stream-table-duality-formula",
            scenarioProblem: "An accounting application requires an immutable audit trail and instant balance queries across 50 million accounts. How does the stream-table duality govern the design?",
            interviewPrompt: "Explain the stream-table duality. How does Event Sourcing combined with CQRS simplify data evolution and auditing?",
            tradeoffs: ["Full audit history and replayability vs Eventual consistency on read views", "Write-side simplicity vs Query-side projection synchronization"],
            technologies: ["EventStore", "Apache Kafka", "Axon Framework"],
            sourceRef: "DDIA Chapter 11, pp. 444-448"
          }
        ]
      },
      {
        sectionNumber: "11.3",
        title: "Processing Streams & Windowing",
        pageStart: 448,
        pageEnd: 464,
        concepts: [
          {
            name: "Event Time vs Processing Time & Windowing",
            slug: "event-time-windowing",
            summary: "Processing time uses the stream processor's local clock; event time uses the timestamp embedded in the event when it occurred. In the presence of network delays or consumer restarts, processing time produces distorted metrics. Window types include Tumbling, Hopping, Sliding, and Session windows.",
            whyItMatters: "Accurate metrics (e.g. ad click fraud, financial metrics) require event-time windowing with low watermarks to handle straggler events.",
            coreMechanics: "Watermarks establish the threshold before which all events are assumed received. Late-arriving stragglers can be dropped or trigger window recalibration.",
            visualType: "windowing-types-diagram",
            scenarioProblem: "A mobile device goes offline for 3 hours, then uploads 1,000 buffered events. If your stream analytics engine uses processing-time windows, what happens to your hourly traffic chart?",
            interviewPrompt: "What is the difference between event time and processing time in stream processing? Explain the differences between tumbling, hopping, and session windows.",
            tradeoffs: ["Event-time accuracy vs Watermark buffering delay", "Deterministic replayability vs State memory footprint for late events"],
            technologies: ["Apache Flink", "Apache Beam", "Google Cloud Dataflow", "Kafka Streams"],
            sourceRef: "DDIA Chapter 11, pp. 452-457"
          }
        ]
      }
    ]
  }
];
