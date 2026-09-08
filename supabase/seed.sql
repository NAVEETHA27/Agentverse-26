-- ==============================================================================
-- AI-Powered Alumni Career & Networking Platform (AlumniVerse)
-- Master Realistic Seed Data
-- SINGLE SOURCE OF TRUTH: 03_DATABASE_AND_DATA_MODEL.md & Core Demo Scenario
-- ==============================================================================

-- 1. SEED INSTITUTIONS
INSERT INTO public.institutions (id, name, short_name, type, location, country, website, description)
VALUES 
('11111111-1111-1111-1111-111111111111', 'ABC College of Engineering', 'ABC CE', 'college', 'Chennai', 'India', 'https://abc-eng.edu', 'Premier engineering college renowned for electronics and computing disciplines.'),
('22222222-2222-2222-2222-222222222222', 'XYZ University of Technology', 'XYZ Tech', 'university', 'Bangalore', 'India', 'https://xyz-tech.edu', 'Research-driven university focused on artificial intelligence and cloud computing.'),
('33333333-3333-3333-3333-333333333333', 'Global Institute of Science & Technology', 'GIST', 'institute', 'Hyderabad', 'India', 'https://gist.edu', 'Leading technical institute with extensive alumni across Fortune 500 tech companies.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. SEED DEGREES
INSERT INTO public.degrees (id, name, level, field)
VALUES
('d1111111-1111-1111-1111-111111111111', 'B.Tech', 'undergraduate', 'Electronics and Communication Engineering'),
('d2222222-2222-2222-2222-222222222222', 'B.Tech', 'undergraduate', 'Computer Science and Engineering'),
('d3333333-3333-3333-3333-333333333333', 'M.Tech', 'postgraduate', 'Cloud Computing & Distributed Systems'),
('d4444444-4444-4444-4444-444444444444', 'M.Tech', 'postgraduate', 'Artificial Intelligence & Machine Learning')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED STANDARDIZED SKILLS
INSERT INTO public.skills (id, name, category, description)
VALUES
('s0000001-0000-0000-0000-000000000001', 'Python', 'Programming', 'General-purpose programming language widely used in automation, backend, and data science.'),
('s0000002-0000-0000-0000-000000000002', 'Java', 'Programming', 'Enterprise object-oriented programming language for robust distributed applications.'),
('s0000003-0000-0000-0000-000000000003', 'SQL', 'Databases', 'Standard structured query language for relational database management.'),
('s0000004-0000-0000-0000-000000000004', 'Linux', 'Operating Systems', 'Unix-like open-source operating system essential for servers and cloud infrastructure.'),
('s0000005-0000-0000-0000-000000000005', 'IoT & Embedded', 'Hardware', 'Microcontroller development, sensors, MQTT, and hardware-software integration.'),
('s0000006-0000-0000-0000-000000000006', 'AWS', 'Cloud Computing', 'Amazon Web Services cloud computing platform including EC2, S3, IAM, and VPC.'),
('s0000007-0000-0000-0000-000000000007', 'Docker', 'DevOps', 'Containerization platform for packaging and isolating distributed software applications.'),
('s0000008-0000-0000-0000-000000000008', 'Kubernetes', 'DevOps', 'Automated container orchestration system for deploying, scaling, and managing containerized apps.'),
('s0000009-0000-0000-0000-000000000009', 'CI/CD', 'DevOps', 'Continuous integration and continuous deployment automation pipelines (GitHub Actions, Jenkins).'),
('s0000010-0000-0000-0000-000000000010', 'Terraform', 'DevOps', 'Infrastructure as Code software tool for declarative cloud provisioning.'),
('s0000011-0000-0000-0000-000000000011', 'Spring Boot', 'Backend', 'Java-based framework for microservices development and scalable web APIs.'),
('s0000012-0000-0000-0000-000000000012', 'Azure', 'Cloud Computing', 'Microsoft Azure cloud computing services and active directory administration.'),
('s0000013-0000-0000-0000-000000000013', 'Cybersecurity', 'Security', 'Network security, SIEM, threat detection, and cloud infrastructure hardening.'),
('s0000014-0000-0000-0000-000000000014', 'Machine Learning', 'AI', 'Statistical modeling, predictive algorithms, and deep learning architectures.'),
('s0000015-0000-0000-0000-000000000015', 'PyTorch', 'AI', 'Open-source deep learning framework for computer vision and NLP models.')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED USERS (Unified Identity: Students, Alumni, Mentors)
INSERT INTO public.users (id, email, full_name, username, headline, bio, location, country, visibility)
VALUES
-- Primary Demo User (Student: ECE undergrad transitioning to Cloud)
(
    'u1111111-1111-1111-1111-111111111111',
    'rohan.varma@student.abc.edu',
    'Rohan Varma',
    'rohan_v',
    'ECE Senior Student @ ABC College | Aspiring Cloud Engineer',
    'Passionate final-year student with strong electronics and programming fundamentals, actively transitioning into cloud infrastructure, containerization, and AWS architecture.',
    'Chennai',
    'India',
    'public'
),
-- Alumni #1 & Primary Recommended Mentor (The Killer Match)
(
    'u2222222-2222-2222-2222-222222222222',
    'rahul.sharma@aws.com',
    'Rahul Sharma',
    'rahul_cloud',
    'Senior Cloud Architect @ AWS | ABC College ECE Alum (''21)',
    'Transitioned from an ECE undergrad into cloud engineering. Now architecting resilient multi-region enterprise platforms at AWS. Dedicated mentor for students making the tech transition.',
    'Bangalore',
    'India',
    'public'
),
-- Alumni #2 (Software Engineering Transition Mentor)
(
    'u3333333-3333-3333-3333-333333333333',
    'ananya.patel@microsoft.com',
    'Ananya Patel',
    'ananya_dev',
    'Software Engineer II @ Microsoft | ABC College ECE Alum (''20)',
    'ECE alumna who pivoted to large-scale backend systems. Mentors students on DSA, Java, Spring Boot, and technical interview strategies.',
    'Hyderabad',
    'India',
    'public'
),
-- Professional / Mentor #3 (DevOps / SRE from Broader Network)
(
    'u4444444-4444-4444-4444-444444444444',
    'priya.nair@google.com',
    'Priya Nair',
    'priya_sre',
    'Site Reliability Engineer @ Google | XYZ Tech Alum (''22)',
    'Passionate about Kubernetes reliability, observability, and infrastructure scaling. Regular speaker at cloud-native meetups.',
    'Bangalore',
    'India',
    'public'
),
-- Professional / Mentor #4 (Cybersecurity Lead)
(
    'u5555555-5555-5555-5555-555555555555',
    'vikram.rao@cisco.com',
    'Vikram Rao',
    'vikram_sec',
    'Cybersecurity Lead @ Cisco | Cloud Security & Threat Detection',
    '10+ years securing cloud networks and zero-trust infrastructure. Open to mentoring students in network security and ethical hacking.',
    'Chennai',
    'India',
    'public'
)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 5. SEED EDUCATION JOURNEYS (Multi-institution demonstration)
INSERT INTO public.education_records (id, user_id, institution_id, degree_id, field_of_study, start_year, end_year, graduation_year, expected_graduation_year, status, description)
VALUES
-- Student Rohan (Current ECE Student at ABC College)
(
    'e1111111-1111-1111-1111-111111111111',
    'u1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111', -- ABC College
    'd1111111-1111-1111-1111-111111111111', -- B.Tech ECE
    'Electronics and Communication Engineering',
    2022, 2026, NULL, 2026,
    'current',
    'Coursework in Microprocessors, Computer Networks, Linux OS, and Embedded Programming.'
),
-- Mentor Rahul Sharma (Alumni of ABC College, then M.Tech at XYZ University)
(
    'e2222222-2222-2222-2222-222222222222',
    'u2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111', -- ABC College
    'd1111111-1111-1111-1111-111111111111', -- B.Tech ECE
    'Electronics and Communication Engineering',
    2017, 2021, 2021, NULL,
    'graduated',
    'Graduated with honors. Active lead of the college Open Source Society.'
),
(
    'e2222223-2222-2222-2222-222222222222',
    'u2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222', -- XYZ Univ
    'd3333333-3333-3333-3333-333333333333', -- M.Tech Cloud
    'Cloud Computing & Distributed Systems',
    2021, 2023, 2023, NULL,
    'graduated',
    'Specialized in distributed consensus algorithms and Kubernetes scheduler architecture.'
),
-- Mentor Ananya Patel (Alumni of ABC College)
(
    'e3333333-3333-3333-3333-333333333333',
    'u3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111', -- ABC College
    'd1111111-1111-1111-1111-111111111111',
    'Electronics and Communication Engineering',
    2016, 2020, 2020, NULL,
    'graduated',
    'Chair of Women in Tech Club. Transitioned to full stack backend engineering.'
),
-- Mentor Priya Nair (XYZ University)
(
    'e4444444-4444-4444-4444-444444444444',
    'u4444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'd2222222-2222-2222-2222-222222222222',
    'Computer Science and Engineering',
    2018, 2022, 2022, NULL,
    'graduated',
    'Core member of Linux User Group.'
),
-- Mentor Vikram Rao (GIST)
(
    'e5555555-5555-5555-5555-555555555555',
    'u5555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    'd2222222-2222-2222-2222-222222222222',
    'Computer Science and Engineering',
    2015, 2019, 2019, NULL,
    'graduated',
    'Founded College Cybersecurity Defense Lab.'
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED PROFESSIONAL PROFILES
INSERT INTO public.professional_profiles (id, user_id, current_company, current_role, industry, years_of_experience, open_to_work, open_to_mentor, open_to_hiring, open_to_referrals)
VALUES
('p1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', NULL, 'Student Researcher', 'Higher Education', 0, true, false, false, false),
('p2222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', 'Amazon Web Services', 'Senior Cloud Architect', 'Cloud Computing', 5.5, false, true, true, true),
('p3333333-3333-3333-3333-333333333333', 'u3333333-3333-3333-3333-333333333333', 'Microsoft', 'Software Engineer II', 'Software Engineering', 4.5, false, true, false, true),
('p4444444-4444-4444-4444-444444444444', 'u4444444-4444-4444-4444-444444444444', 'Google', 'Site Reliability Engineer', 'Cloud Infrastructure', 3.0, false, true, true, true),
('p5555555-5555-5555-5555-555555555555', 'u5555555-5555-5555-5555-555555555555', 'Cisco Systems', 'Cybersecurity Lead', 'Cybersecurity', 6.0, false, true, false, false)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED EXPERIENCES
INSERT INTO public.experiences (id, user_id, company_name, job_title, employment_type, industry, location, start_date, end_date, is_current, description)
VALUES
(
    'x2222222-2222-2222-2222-222222222222',
    'u2222222-2222-2222-2222-222222222222',
    'Amazon Web Services (AWS)',
    'Senior Cloud Architect',
    'full_time',
    'Cloud Computing',
    'Bangalore, India',
    '2023-01-01', NULL, true,
    'Designing enterprise-grade cloud native platforms, zero-downtime multi-region failovers, and Kubernetes clusters.'
),
(
    'x2222223-2222-2222-2222-222222222222',
    'u2222222-2222-2222-2222-222222222222',
    'CloudTech Solutions',
    'DevOps Engineer',
    'full_time',
    'DevOps',
    'Chennai, India',
    '2021-06-01', '2022-12-31', false,
    'Managed CI/CD deployment pipelines, automated Docker container building, and terraformed AWS environments.'
)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED USER SKILLS (Enabling exact skill-gap calculation)
INSERT INTO public.user_skills (id, user_id, skill_id, proficiency_level, years_experience, source, verified)
VALUES
-- Student Rohan (Current Profile)
('us111-1', 'u1111111-1111-1111-1111-111111111111', 's0000001-0000-0000-0000-000000000001', 'intermediate', 2, 'self_reported', true), -- Python
('us111-2', 'u1111111-1111-1111-1111-111111111111', 's0000002-0000-0000-0000-000000000002', 'intermediate', 2, 'self_reported', true), -- Java
('us111-3', 'u1111111-1111-1111-1111-111111111111', 's0000003-0000-0000-0000-000000000003', 'intermediate', 1.5, 'self_reported', true), -- SQL
('us111-4', 'u1111111-1111-1111-1111-111111111111', 's0000004-0000-0000-0000-000000000004', 'intermediate', 2, 'self_reported', true), -- Linux
('us111-5', 'u1111111-1111-1111-1111-111111111111', 's0000005-0000-0000-0000-000000000005', 'advanced', 3, 'project', true),       -- IoT

-- Alumni Rahul Sharma (Possesses the missing skills!)
('us222-1', 'u2222222-2222-2222-2222-222222222222', 's0000006-0000-0000-0000-000000000006', 'expert', 5.5, 'experience', true), -- AWS
('us222-2', 'u2222222-2222-2222-2222-222222222222', 's0000007-0000-0000-0000-000000000007', 'expert', 5.0, 'experience', true), -- Docker
('us222-3', 'u2222222-2222-2222-2222-222222222222', 's0000008-0000-0000-0000-000000000008', 'expert', 4.5, 'experience', true), -- Kubernetes
('us222-4', 'u2222222-2222-2222-2222-222222222222', 's0000009-0000-0000-0000-000000000009', 'advanced', 4.0, 'experience', true), -- CI/CD
('us222-5', 'u2222222-2222-2222-2222-222222222222', 's0000010-0000-0000-0000-000000000010', 'expert', 4.0, 'experience', true), -- Terraform
('us222-6', 'u2222222-2222-2222-2222-222222222222', 's0000004-0000-0000-0000-000000000004', 'expert', 6.0, 'experience', true)  -- Linux
ON CONFLICT (id) DO NOTHING;

-- 9. SEED PROJECTS
INSERT INTO public.projects (id, user_id, title, description, project_url, github_url, project_type)
VALUES
(
    'pr111111-1111-1111-1111-111111111111',
    'u1111111-1111-1111-1111-111111111111',
    'IoT Smart Environmental Monitor',
    'Built an autonomous sensor station using ESP32, Python backend, MQTT broker, and SQL telemetry database.',
    'https://iot-monitor.demo',
    'https://github.com/rohan/iot-monitor',
    'academic'
),
(
    'pr222222-2222-2222-2222-222222222222',
    'u2222222-2222-2222-2222-222222222222',
    'Automated Multi-Region Kubernetes Failover',
    'Open-source Terraform module & operator for automated EKS failover across multiple cloud availability zones.',
    'https://aws-failover.demo',
    'https://github.com/rahul/k8s-cloud-failover',
    'professional'
)
ON CONFLICT (id) DO NOTHING;

-- 10. SEED CAREER GOAL FOR STUDENT ROHAN
INSERT INTO public.career_goals (id, user_id, goal_text, target_role, target_industry, target_company, priority, status)
VALUES
(
    'cg111111-1111-1111-1111-111111111111',
    'u1111111-1111-1111-1111-111111111111',
    'I want to become a Cloud Engineer.',
    'Cloud Engineer',
    'Cloud Computing & Infrastructure',
    'Amazon Web Services, Microsoft, or Google',
    1,
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- 11. SEED SKILL GAPS FOR ROHAN'S GOAL
INSERT INTO public.skill_gaps (id, user_id, career_goal_id, skill_id, importance, current_level, required_level, gap_score, reason, status)
VALUES
('sg1', 'u1111111-1111-1111-1111-111111111111', 'cg111111-1111-1111-1111-111111111111', 's0000006-0000-0000-0000-000000000006', 'critical', 'none', 'intermediate', 0.85, 'Core foundational cloud provider for provisioning compute and VPCs.', 'identified'),
('sg2', 'u1111111-1111-1111-1111-111111111111', 'cg111111-1111-1111-1111-111111111111', 's0000007-0000-0000-0000-000000000007', 'critical', 'none', 'intermediate', 0.80, 'Essential containerization standard required by all modern infrastructure teams.', 'identified'),
('sg3', 'u1111111-1111-1111-1111-111111111111', 'cg111111-1111-1111-1111-111111111111', 's0000008-0000-0000-0000-000000000008', 'important', 'none', 'intermediate', 0.75, 'Industry standard container orchestration platform for scalable cloud workloads.', 'identified'),
('sg4', 'u1111111-1111-1111-1111-111111111111', 'cg111111-1111-1111-1111-111111111111', 's0000009-0000-0000-0000-000000000009', 'important', 'none', 'intermediate', 0.70, 'Automated build and continuous deployment pipelines for reliable cloud releases.', 'identified')
ON CONFLICT (id) DO NOTHING;

-- 12. SEED CAREER ROADMAP
INSERT INTO public.career_roadmaps (id, user_id, career_goal_id, title, description, duration_estimate, status)
VALUES
(
    'rm111111-1111-1111-1111-111111111111',
    'u1111111-1111-1111-1111-111111111111',
    'cg111111-1111-1111-1111-111111111111',
    'Cloud Engineering Acceleration Roadmap',
    'Personalized roadmap generated by Career Agent taking into account ECE background and identified containerization gaps.',
    '6 Months',
    'in_progress'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.roadmap_items (id, roadmap_id, title, description, item_type, skill_id, sequence_order, status, completed_at)
VALUES
('rmi-1', 'rm111111-1111-1111-1111-111111111111', 'Linux System Administration & Networking', 'Master terminal commands, permissions, systemd, DNS, TCP/IP, and SSH protocols.', 'learn_skill', 's0000004-0000-0000-0000-000000000004', 1, 'completed', now() - interval '14 days'),
('rmi-2', 'rm111111-1111-1111-1111-111111111111', 'AWS Core Architecture (EC2, S3, VPC, IAM)', 'Complete AWS cloud practitioner & solutions architect fundamentals.', 'learn_skill', 's0000006-0000-0000-0000-000000000006', 2, 'in_progress', NULL),
('rmi-3', 'rm111111-1111-1111-1111-111111111111', 'Docker Containerization & Microservices Packaging', 'Package full-stack Python/Java apps into lean multi-stage Docker images.', 'project', 's0000007-0000-0000-0000-000000000007', 3, 'not_started', NULL),
('rmi-4', 'rm111111-1111-1111-1111-111111111111', 'Kubernetes Deployment & CI/CD Pipeline', 'Deploy containerized workloads to EKS with automated GitHub Actions testing.', 'project', 's0000008-0000-0000-0000-000000000008', 4, 'not_started', NULL),
('rmi-5', 'rm111111-1111-1111-1111-111111111111', 'Connect with Cloud Engineer Alumni Mentors', 'Engage with recommended alumni to review projects and discuss entry-level cloud expectations.', 'mentor', NULL, 5, 'not_started', NULL)
ON CONFLICT (id) DO NOTHING;

-- 13. SEED MENTORSHIP PREFERENCES
INSERT INTO public.mentorship_preferences (id, user_id, mentorship_type, topics, preferred_mode, max_mentees, is_available)
VALUES
('mp222', 'u2222222-2222-2222-2222-222222222222', 'career_guidance', '["Cloud Computing", "AWS Architecture", "ECE to Tech Career Pivot", "Resume Review"]'::jsonb, 'chat', 3, true),
('mp333', 'u3333333-3333-3333-3333-333333333333', 'technical', '["Software Engineering", "Java/Spring Boot", "System Design", "Interview Prep"]'::jsonb, 'chat', 2, true)
ON CONFLICT (id) DO NOTHING;

-- 14. SEED MATCH RESULTS (Demonstrating deterministic 94% score)
INSERT INTO public.match_results (id, user_id, matched_user_id, career_goal_id, overall_score, career_goal_score, skill_score, education_score, industry_score, experience_score, explanation, match_reasons, search_scope)
VALUES
(
    'mr222222-2222-2222-2222-222222222222',
    'u1111111-1111-1111-1111-111111111111',
    'u2222222-2222-2222-2222-222222222222',
    'cg111111-1111-1111-1111-111111111111',
    94.0,
    30.0, -- Goal match (30/30)
    23.5, -- Skill match: possess AWS, Docker, K8s (23.5/25)
    20.0, -- Same institution: ABC College ECE (20/20)
    14.0, -- Industry: Cloud Computing (14/15)
    6.5,  -- Experience: 5.5 years (6.5/10)
    'Rahul is a premier match: he completed the exact same ECE journey at ABC College and now leads cloud architecture at AWS. His expertise directly covers your critical skill gaps in AWS, Docker, and Kubernetes.',
    '["Alumni of your college (ABC College)", "Made the same ECE to Cloud career transition", "Active expert in your missing skills (AWS, Docker, K8s)", "Currently Senior Cloud Architect at AWS", "Verified mentor open to student guidance"]'::jsonb,
    'institution'
)
ON CONFLICT (id) DO NOTHING;

-- 15. SEED CONNECTIONS & SAMPLE CHAT
INSERT INTO public.connections (id, requester_id, receiver_id, status, connection_type, source, initial_message, accepted_at)
VALUES
(
    'c1212121-1212-1212-1212-121212121212',
    'u1111111-1111-1111-1111-111111111111',
    'u2222222-2222-2222-2222-222222222222',
    'accepted',
    'mentor',
    'ai_recommendation',
    'Hi Rahul, I noticed that you transitioned from an ECE background at ABC College into cloud engineering and now work with AWS and Kubernetes. I am currently working toward an entry-level Cloud Engineer role and would really value your advice on what to prioritize.',
    now() - interval '2 days'
)
ON CONFLICT (id) DO NOTHING;

-- Conversation & Messages
INSERT INTO public.conversations (id, last_message_at)
VALUES ('conv1111-2222-3333-4444-555555555555', now() - interval '1 hour')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (id, conversation_id, user_id)
VALUES 
('cm1', 'conv1111-2222-3333-4444-555555555555', 'u1111111-1111-1111-1111-111111111111'),
('cm2', 'conv1111-2222-3333-4444-555555555555', 'u2222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, message_text, message_type, created_at)
VALUES
(
    'm1',
    'conv1111-2222-3333-4444-555555555555',
    'u1111111-1111-1111-1111-111111111111',
    'Hi Rahul! Thanks so much for connecting. I am in final year ECE at ABC and aiming for a Cloud Engineer role. Any tips on bridging from hardware to cloud?',
    'text',
    now() - interval '2 hours'
),
(
    'm2',
    'conv1111-2222-3333-4444-555555555555',
    'u2222222-2222-2222-2222-222222222222',
    'Hey Rohan, great to meet a junior from ABC! Don''t worry about the ECE background—your Linux and Python foundation will actually give you an edge. My advice: learn AWS fundamentals first, containerize a real app with Docker, and build an automated cloud deployment project before applying.',
    'text',
    now() - interval '1 hour'
)
ON CONFLICT (id) DO NOTHING;

-- 16. SEED RELATIONSHIP INSIGHTS (Demonstrating Relationship Agent loop)
INSERT INTO public.relationship_insights (id, conversation_id, user_id, summary, advice_points, action_items, questions_to_ask, follow_up_suggestion, roadmap_suggestions)
VALUES
(
    'ri111111-1111-1111-1111-111111111111',
    'conv1111-2222-3333-4444-555555555555',
    'u1111111-1111-1111-1111-111111111111',
    'Mentor Rahul confirmed that ECE programming foundations translate well into Cloud Engineering. He advised prioritizing AWS core, Docker packaging, and an automated deployment project.',
    '["Leverage Linux and Python foundations", "Prioritize AWS core services", "Build a containerized deployment project before applying"]'::jsonb,
    '["Complete AWS fundamentals", "Containerize Python application with Docker", "Build an automated cloud deployment project"]'::jsonb,
    '["Which specific AWS certifications (Solutions Architect vs Developer) helped you most during interviews?", "Would you recommend deploying on ECS or EKS for entry-level portfolios?"]'::jsonb,
    'Thank Rahul for the deployment project recommendation and ask for his thoughts on sample project architectures.',
    '[{"title": "Build Automated Cloud Deployment Project", "category": "project", "related_skills": ["AWS", "Docker", "CI/CD"]}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 17. SEED OPPORTUNITIES
INSERT INTO public.opportunities (id, company_name, title, description, opportunity_type, location, work_mode, application_url, is_active)
VALUES
(
    'op111111-1111-1111-1111-111111111111',
    'CloudScale Systems',
    'Cloud & DevOps Engineering Intern',
    'Fast-growing cloud infrastructure firm seeking entry-level interns to build Terraform modules and manage Docker container deployments on AWS.',
    'internship',
    'Bangalore',
    'hybrid',
    'https://cloudscale.careers/intern-cloud',
    true
),
(
    'op222222-2222-2222-2222-222222222222',
    'FinTech Distributed Systems',
    'Junior Site Reliability Engineer',
    'Manage container clusters, assist with CI/CD deployment pipelines, and maintain high-uptime cloud operations.',
    'job',
    'Chennai',
    'remote',
    'https://fintech.careers/jr-sre',
    true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.opportunity_skills (id, opportunity_id, skill_id, importance)
VALUES
('os1', 'op111111-1111-1111-1111-111111111111', 's0000006-0000-0000-0000-000000000006', 'required'), -- AWS
('os2', 'op111111-1111-1111-1111-111111111111', 's0000007-0000-0000-0000-000000000007', 'required'), -- Docker
('os3', 'op111111-1111-1111-1111-111111111111', 's0000004-0000-0000-0000-000000000004', 'preferred') -- Linux
ON CONFLICT (id) DO NOTHING;

-- 18. SEED AGENT SESSION & ACTIONS (Demonstrating full Agent Traceability)
INSERT INTO public.agent_sessions (id, user_id, agent_type, goal, status, context, started_at, completed_at)
VALUES
(
    'as111111-1111-1111-1111-111111111111',
    'u1111111-1111-1111-1111-111111111111',
    'networking_agent',
    'Find cloud engineering mentors from my institution who can help with AWS and Docker',
    'completed',
    '{"target_role": "Cloud Engineer", "search_scope": "institution", "retrieved_candidates": 12, "top_candidate": "Rahul Sharma", "score": 94}'::jsonb,
    now() - interval '2 days',
    now() - interval '2 days' + interval '4 seconds'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.agent_actions (id, session_id, action_type, input_data, output_data, status, requires_approval, approved_at)
VALUES
(
    'aa1',
    'as111111-1111-1111-1111-111111111111',
    'analyze_goal',
    '{"goal": "I want to become a Cloud Engineer"}'::jsonb,
    '{"target_role": "Cloud Engineer", "required_skills": ["AWS", "Docker", "Kubernetes", "CI/CD"]}'::jsonb,
    'completed',
    false,
    NULL
),
(
    'aa2',
    'as111111-1111-1111-1111-111111111111',
    'search_alumni',
    '{"institution_id": "11111111-1111-1111-1111-111111111111", "domain": "Cloud"}'::jsonb,
    '{"candidates_found": 12}'::jsonb,
    'completed',
    false,
    NULL
),
(
    'aa3',
    'as111111-1111-1111-1111-111111111111',
    'calculate_match_score',
    '{"candidate_id": "u2222222-2222-2222-2222-222222222222"}'::jsonb,
    '{"overall_score": 94.0, "breakdown": {"goal": 30, "skills": 23.5, "education": 20, "industry": 14, "experience": 6.5}}'::jsonb,
    'completed',
    false,
    NULL
),
(
    'aa4',
    'as111111-1111-1111-1111-111111111111',
    'generate_personalized_message',
    '{"recipient": "Rahul Sharma", "shared_context": "ABC College ECE transition"}'::jsonb,
    '{"message_text": "Hi Rahul, I noticed that you transitioned from an ECE background at ABC College into cloud engineering..."}'::jsonb,
    'completed',
    true,
    now() - interval '2 days'
)
ON CONFLICT (id) DO NOTHING;
