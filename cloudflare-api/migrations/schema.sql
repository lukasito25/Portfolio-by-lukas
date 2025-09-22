-- Portfolio Database Schema for Cloudflare D1
-- This mirrors the Prisma schema but in pure SQL

-- NextAuth.js required tables
CREATE TABLE Account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX Account_provider_providerAccountId_key ON Account(provider, providerAccountId);

CREATE TABLE Session (
    id TEXT PRIMARY KEY,
    sessionToken TEXT UNIQUE NOT NULL,
    userId TEXT NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE User (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    emailVerified DATETIME,
    image TEXT,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'USER',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE VerificationToken (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires DATETIME NOT NULL
);

CREATE UNIQUE INDEX VerificationToken_identifier_token_key ON VerificationToken(identifier, token);

-- Portfolio content tables
CREATE TABLE Technology (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    category TEXT,
    level TEXT NOT NULL DEFAULT 'BEGINNER',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Tag (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Project (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    thumbnail TEXT,
    images TEXT,
    demoUrl TEXT,
    githubUrl TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    featured INTEGER NOT NULL DEFAULT 0,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    metaTitle TEXT,
    metaDescription TEXT,
    authorId TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    publishedAt DATETIME,
    FOREIGN KEY (authorId) REFERENCES User(id)
);

CREATE TABLE BlogPost (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    thumbnail TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    featured INTEGER NOT NULL DEFAULT 0,
    metaTitle TEXT,
    metaDescription TEXT,
    authorId TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    readTime INTEGER,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    publishedAt DATETIME,
    FOREIGN KEY (authorId) REFERENCES User(id)
);

CREATE TABLE ContactSubmission (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    status TEXT NOT NULL DEFAULT 'NEW',
    responded INTEGER NOT NULL DEFAULT 0,
    respondedAt DATETIME,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Newsletter (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscribed INTEGER NOT NULL DEFAULT 1,
    confirmed INTEGER NOT NULL DEFAULT 0,
    source TEXT,
    ipAddress TEXT,
    subscribedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmedAt DATETIME,
    unsubscribedAt DATETIME
);

CREATE TABLE Analytics (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    title TEXT,
    sessionId TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    country TEXT,
    city TEXT,
    referrer TEXT,
    source TEXT,
    medium TEXT,
    campaign TEXT,
    duration INTEGER,
    bounce INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX Analytics_path_idx ON Analytics(path);
CREATE INDEX Analytics_sessionId_idx ON Analytics(sessionId);
CREATE INDEX Analytics_createdAt_idx ON Analytics(createdAt);

CREATE TABLE MediaFile (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    originalName TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    alt TEXT,
    width INTEGER,
    height INTEGER,
    folder TEXT,
    tags TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Junction tables for many-to-many relationships
CREATE TABLE _ProjectTechnologies (
    A TEXT NOT NULL,
    B TEXT NOT NULL,
    FOREIGN KEY (A) REFERENCES Project(id) ON DELETE CASCADE,
    FOREIGN KEY (B) REFERENCES Technology(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX _ProjectTechnologies_AB_unique ON _ProjectTechnologies(A, B);
CREATE INDEX _ProjectTechnologies_B_index ON _ProjectTechnologies(B);

CREATE TABLE _BlogPostTags (
    A TEXT NOT NULL,
    B TEXT NOT NULL,
    FOREIGN KEY (A) REFERENCES BlogPost(id) ON DELETE CASCADE,
    FOREIGN KEY (B) REFERENCES Tag(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX _BlogPostTags_AB_unique ON _BlogPostTags(A, B);
CREATE INDEX _BlogPostTags_B_index ON _BlogPostTags(B);