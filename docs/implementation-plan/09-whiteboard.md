# System Design Whiteboard Canvas

## 1. Interactive Architecture Canvas
A drag-and-drop, connection-oriented whiteboard built for system design interviewing:
- **Node Catalog**:
  - `Client` (Mobile, Web, IoT)
  - `DNS / CDN` (Cloudflare, CloudFront)
  - `Load Balancer` (ALB, Nginx, Envoy)
  - `API Gateway` (Rate limiting, Auth)
  - `Application Server` (Stateless microservices)
  - `Cache` (Redis cluster, Memcached)
  - `Relational Database` (PostgreSQL with read replicas)
  - `NoSQL Document / Key-Value` (MongoDB, Cassandra, DynamoDB)
  - `Message Broker / Event Stream` (Kafka, RabbitMQ)
  - `Worker / Background Job` (Celery, BullMQ, Go worker)
  - `Object Storage` (S3, Blob)
- **Edge Connections**:
  - Protocols (HTTPS, gRPC, WebSocket, TCP, Async Event)
  - Synchronous vs Asynchronous indicators
- **Version Control & Artifact Storage**:
  - Save as versioned artifacts (e.g., URL Shortener v1 -> v2 -> v3)
  - AI critique analyzing bottlenecks, single points of failure, and replication lag risks.
