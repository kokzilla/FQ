--
-- PostgreSQL database dump
--

-- \restrict T5gRQZaMmR9nDoUXonKVfM0xcR5wxdoiSjjkMYEwaS2eIlsJj1LpJgd5AAZdcqq

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."ScoreItem" DROP CONSTRAINT IF EXISTS "ScoreItem_questionItemId_fkey";
ALTER TABLE IF EXISTS ONLY public."ScoreItem" DROP CONSTRAINT IF EXISTS "ScoreItem_assessmentId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuestionItem" DROP CONSTRAINT IF EXISTS "QuestionItem_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."FindingAttachment" DROP CONSTRAINT IF EXISTS "FindingAttachment_assessmentId_fkey";
ALTER TABLE IF EXISTS ONLY public."BuildingStaff" DROP CONSTRAINT IF EXISTS "BuildingStaff_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."BuildingStaff" DROP CONSTRAINT IF EXISTS "BuildingStaff_buildingId_fkey";
ALTER TABLE IF EXISTS ONLY public."Assessment" DROP CONSTRAINT IF EXISTS "Assessment_buildingId_fkey";
ALTER TABLE IF EXISTS ONLY public."Assessment" DROP CONSTRAINT IF EXISTS "Assessment_assessorId_fkey";
DROP INDEX IF EXISTS public."User_userlogin_key";
DROP INDEX IF EXISTS public."ScoreItem_assessmentId_questionItemId_key";
DROP INDEX IF EXISTS public."Building_code_key";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."SystemSetting" DROP CONSTRAINT IF EXISTS "SystemSetting_pkey";
ALTER TABLE IF EXISTS ONLY public."ScoreItem" DROP CONSTRAINT IF EXISTS "ScoreItem_pkey";
ALTER TABLE IF EXISTS ONLY public."QuestionItem" DROP CONSTRAINT IF EXISTS "QuestionItem_pkey";
ALTER TABLE IF EXISTS ONLY public."FindingAttachment" DROP CONSTRAINT IF EXISTS "FindingAttachment_pkey";
ALTER TABLE IF EXISTS ONLY public."EvaluationRound" DROP CONSTRAINT IF EXISTS "EvaluationRound_pkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_pkey";
ALTER TABLE IF EXISTS ONLY public."Building" DROP CONSTRAINT IF EXISTS "Building_pkey";
ALTER TABLE IF EXISTS ONLY public."BuildingStaff" DROP CONSTRAINT IF EXISTS "BuildingStaff_pkey";
ALTER TABLE IF EXISTS ONLY public."Assessment" DROP CONSTRAINT IF EXISTS "Assessment_pkey";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."SystemSetting";
DROP TABLE IF EXISTS public."ScoreItem";
DROP TABLE IF EXISTS public."QuestionItem";
DROP TABLE IF EXISTS public."FindingAttachment";
DROP TABLE IF EXISTS public."EvaluationRound";
DROP TABLE IF EXISTS public."Category";
DROP TABLE IF EXISTS public."BuildingStaff";
DROP TABLE IF EXISTS public."Building";
DROP TABLE IF EXISTS public."Assessment";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Assessment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Assessment" (
    id text NOT NULL,
    "roundId" text DEFAULT 'round-2570'::text,
    "buildingId" text NOT NULL,
    "staffId" text,
    "assessorId" text NOT NULL,
    "responsibleStaffText" text NOT NULL,
    "assessedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "totalScoreObtained" double precision NOT NULL,
    "totalMaxScore" double precision NOT NULL,
    percentage double precision NOT NULL,
    grade text NOT NULL,
    "strengthsSummary" text,
    "urgentProblems" text,
    "correctivePlan" text,
    "targetDeadline" timestamp(3) without time zone,
    "followUpResult" text,
    "isFollowedUp" boolean DEFAULT false NOT NULL,
    "followedUpAt" timestamp(3) without time zone,
    "signatureImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Building; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Building" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    floors integer DEFAULT 1,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BuildingStaff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BuildingStaff" (
    id text NOT NULL,
    "buildingId" text NOT NULL,
    "userId" text,
    "staffName" text NOT NULL,
    phone text,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    "order" integer NOT NULL
);


--
-- Name: EvaluationRound; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EvaluationRound" (
    id text NOT NULL,
    name text NOT NULL,
    year text NOT NULL,
    description text,
    "startDate" text NOT NULL,
    "endDate" text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FindingAttachment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FindingAttachment" (
    id text NOT NULL,
    "assessmentId" text NOT NULL,
    type text NOT NULL,
    "fileUrl" text NOT NULL,
    caption text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: QuestionItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."QuestionItem" (
    id integer NOT NULL,
    "categoryId" integer NOT NULL,
    "itemNumber" integer NOT NULL,
    title text NOT NULL,
    "maxScore" integer DEFAULT 5 NOT NULL
);


--
-- Name: ScoreItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ScoreItem" (
    id text NOT NULL,
    "assessmentId" text NOT NULL,
    "questionItemId" integer NOT NULL,
    score integer,
    "isNA" boolean DEFAULT false NOT NULL,
    "defectNote" text,
    "photoUrl" text
);


--
-- Name: SystemSetting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SystemSetting" (
    key text NOT NULL,
    value text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    userlogin text NOT NULL,
    "fullName" text NOT NULL,
    email text,
    role text DEFAULT 'AUDITOR'::text NOT NULL,
    "departmentId" text,
    "positionName" text,
    phone text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: Assessment; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Building; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Building" VALUES ('c87dea49-468c-467e-80c4-b3161e76f861', 'B05', 'อาคาร 5', 3, 'สังกัด คณะวิทยาศาสตร์', true, '2026-11-05 03:45:46.34', '2026-11-05 05:48:53.238');
INSERT INTO public."Building" VALUES ('529e2dcc-b0c3-48b8-b66e-ea2ea5a695e9', 'B17', 'อาคาร 17 (อาคารนวัตปัญญา)', 4, 'สังกัด สำนักวิทยบริการและเทคโนโลยีสารสนเทศ', true, '2026-11-05 03:45:46.359', '2026-11-05 05:48:53.259');
INSERT INTO public."Building" VALUES ('83b80602-3275-4b84-94d0-17d6efb2b532', 'B20', 'อาคาร 20 (อาคารสิริวิทยเกษตร)', 4, 'สังกัด คณะเทคโนโลยีการเกษตร', true, '2026-11-05 03:45:46.364', '2026-11-05 05:48:53.266');
INSERT INTO public."Building" VALUES ('4b04657f-a7d1-48bd-b803-303ef8fa1541', 'B24', 'อาคาร 24 (คณะวิทยาการจัดการ)', 7, 'สังกัด คณะวิทยาการจัดการ', true, '2026-11-05 03:37:53.122', '2026-11-05 05:48:53.272');
INSERT INTO public."Building" VALUES ('9d340188-149a-47c6-b135-9ac5165c4689', 'B26', 'อาคาร 26 (อาคารอเนกคุณาคาร 2)', 4, 'สังกัด คณะครุศาสตร์ + คณะมนุษยศาสตร์ฯ (สาขาวิชาศิลปะ)', true, '2026-11-05 03:45:46.376', '2026-11-05 05:48:53.28');
INSERT INTO public."Building" VALUES ('ae5b74a2-a766-4b32-9d02-2147d7f43b14', 'B06', 'อาคาร 6', 3, 'สังกัด คณะมนุษยศาสตร์และสังคมศาสตร์', true, '2026-11-05 03:45:46.342', '2026-11-05 05:48:53.241');
INSERT INTO public."Building" VALUES ('0d793dbf-5bf1-4799-82f6-9d0f0494f201', 'B07', 'อาคาร 7', 3, 'สังกัด คณะวิทยาศาสตร์', true, '2026-11-05 03:45:46.344', '2026-11-05 05:48:53.244');
INSERT INTO public."Building" VALUES ('582cbe05-04cb-4585-af38-075fb19844fb', 'B10', 'อาคาร 10', 3, 'สังกัด คณะครุศาสตร์', true, '2026-11-05 03:45:46.346', '2026-11-05 05:48:53.246');
INSERT INTO public."Building" VALUES ('aa6b5228-92f6-4e59-a32b-a20041205ba6', 'B12', 'อาคาร 12 (ศูนย์วิทยาศาสตร์และวิทยาศาสตร์ประยุกต์)', 4, 'สังกัด คณะวิทยาศาสตร์', true, '2026-11-05 03:45:46.348', '2026-11-05 05:48:53.248');
INSERT INTO public."Building" VALUES ('b3ddecc2-61eb-4c24-ac76-26bb3c7e2d15', 'B13', 'อาคาร 13 (คณะพยาบาลศาสตร์)', 4, 'สังกัด คณะพยาบาลศาสตร์', true, '2026-11-05 03:45:46.35', '2026-11-05 05:48:53.25');
INSERT INTO public."Building" VALUES ('e2e48bb4-de09-46fe-a32f-e1d1d973177b', 'B14', 'อาคาร 14', 3, 'สังกัด คณะครุศาสตร์ + คณะมนุษยศาสตร์ฯ (สาขาวิชานาฏศิลป์+ดนตรี)', true, '2026-11-05 03:45:46.352', '2026-11-05 05:48:53.251');
INSERT INTO public."Building" VALUES ('f788f6aa-df6d-4494-8e09-065043c3dacc', 'B16', 'อาคาร 16 (อาคารสิ่งทอ)', 2, 'สังกัด คณะวิทยาศาสตร์', true, '2026-11-05 03:45:46.357', '2026-11-05 05:48:53.257');
INSERT INTO public."Building" VALUES ('0040679c-c2ad-4a69-9045-91119bce6e59', 'B18', 'อาคาร 18 (อาคารเฉลิมพระเกียรติ 7 รอบ พระชนมพรรษา)', 5, 'สังกัด คณะเทคโนโลยีอุตสาหกรรม', true, '2026-11-05 03:37:53.119', '2026-11-05 05:48:53.262');
INSERT INTO public."Building" VALUES ('e4d58f74-4d82-49e1-8373-f8dadbc43289', 'B19', 'อาคาร 19 (อาคารสิริวิชญากร)', 5, 'สังกัด คณะครุศาสตร์', true, '2026-11-05 03:45:46.363', '2026-11-05 05:48:53.264');
INSERT INTO public."Building" VALUES ('7934e1d2-518e-4318-85fb-cab18fcbbaa3', 'B21', 'อาคาร 21', 3, 'สังกัด สำนักส่งเสริมวิชาการและงานทะเบียน', true, '2026-11-05 03:45:46.366', '2026-11-05 05:48:53.267');
INSERT INTO public."Building" VALUES ('734b53d7-59d0-471d-bfe2-b6289c7cb2d5', 'B22', 'อาคาร 22 (อาคารวิทยาศาสตร์สุขภาพ)', 8, 'สังกัด คณะวิทยาศาสตร์', true, '2026-11-05 03:37:53.121', '2026-11-05 05:48:53.268');
INSERT INTO public."Building" VALUES ('25e688a8-5df2-4079-b0dc-3af537877f9a', 'B23', 'อาคาร 23 (อาคารอเนกคุณาคาร 1 อาคารราชภัฏคอมเพลคซ์)', 4, 'สังกัด สำนักส่งเสริมวิชาการและงานทะเบียน + กองพัฒนานักศึกษา', true, '2026-11-05 03:45:46.37', '2026-11-05 05:48:53.27');
INSERT INTO public."Building" VALUES ('8bd0c52a-c2da-44a4-a507-b0b08f03b20f', 'B25', 'อาคาร 25 (คณะมนุษยศาสตร์และสังคมศาสตร์)', 5, 'สังกัด คณะมนุษยศาสตร์และสังคมศาสตร์', true, '2026-11-05 03:45:46.374', '2026-11-05 05:48:53.275');
INSERT INTO public."Building" VALUES ('b67576c0-4284-48d0-a1fd-acdfb3a39d54', 'B27', 'อาคาร 27 (โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์)', 4, 'สังกัด โรงเรียนสาธิต มหาวิทยาลัยราชภัฏบุรีรัมย์', true, '2026-11-05 03:45:46.378', '2026-11-05 05:48:53.284');
INSERT INTO public."Building" VALUES ('e135cd6d-bc80-4ef5-9596-538ecc47296b', 'B-LIB', 'อาคารบรรณราชนครินทร์ (ห้องสมุด สำนักวิทยบริการฯ)', 4, 'สังกัด สำนักวิทยบริการและเทคโนโลยีสารสนเทศ', true, '2026-11-05 03:45:46.38', '2026-11-05 05:48:53.286');
INSERT INTO public."Building" VALUES ('d9767a01-0718-4526-9aa2-19ba05a8368c', 'B-STAD', 'สนามกีฬากลาง', 1, 'สังกัด คณะครุศาสตร์', true, '2026-11-05 03:45:46.381', '2026-11-05 05:48:53.288');
INSERT INTO public."Building" VALUES ('f1a88782-4f3a-4655-b7c5-3a4ed1ec2fd1', 'B-GYM', 'โรงยิมส์', 2, 'สังกัด คณะครุศาสตร์', true, '2026-11-05 03:45:46.382', '2026-11-05 05:48:53.289');
INSERT INTO public."Building" VALUES ('ed2c1845-059b-4b37-88dc-41dbebf178a5', 'B02', 'อาคาร 2', 3, 'สังกัด คณะวิทยาศาสตร์ (ห้องพยาบาล)', true, '2026-11-05 03:45:46.338', '2026-11-05 05:48:53.235');
INSERT INTO public."Building" VALUES ('cbbc95ec-f199-43a1-9251-9d56c76f3c19', 'B-AUD2', 'หอประชุมมาลิณีจุโฑปะมา', 2, 'คณะกรรมการหอประชุมตามคำสั่งแต่งตั้งของมหาวิทยาลัย', true, '2026-11-05 03:45:46.385', '2026-11-05 05:48:53.292');
INSERT INTO public."Building" VALUES ('14e0a11b-a4b9-4687-b60f-0a97b6f1d87a', 'B-CER', 'อาคารเซรามิกส์', 1, 'สังกัด คณะเทคโนโลยีอุตสาหกรรม', true, '2026-11-05 03:45:46.388', '2026-11-05 05:48:53.296');
INSERT INTO public."Building" VALUES ('9f814059-ae61-4756-8bc4-d7e8595a9956', 'B-WOOD', 'Shop งานไม้ (คณะเทคโนโลยีอุตสาหกรรมเก่า)', 1, 'สังกัด คณะเทคโนโลยีอุตสาหกรรม', true, '2026-11-05 03:45:46.39', '2026-11-05 05:48:53.298');
INSERT INTO public."Building" VALUES ('467c76f8-8007-4e82-a4e7-0799deb929cc', 'B-IT', 'อาคาร IT (อาคารเทคโนโลยีสารสนเทศเก่า)', 2, 'สังกัด คณะวิทยาศาสตร์', true, '2026-11-05 03:45:46.391', '2026-11-05 05:48:53.301');
INSERT INTO public."Building" VALUES ('8b16bf09-ebbc-4159-836a-b8dde54ca425', 'B-CUL', 'ศูนย์วัฒนธรรมอีสานใต้', 2, 'สังกัด สำนักศิลปะและวัฒนธรรม', true, '2026-11-05 03:45:46.393', '2026-11-05 05:48:53.303');
INSERT INTO public."Building" VALUES ('20fe781e-e11c-40d7-8611-a9c3041e713c', 'B-AUD1', 'หอประชุมวิชชาอัตศาสตร์', 2, 'ผอ.กองกลาง', true, '2026-11-05 03:45:46.384', '2026-11-05 05:48:53.29');
INSERT INTO public."Building" VALUES ('31d1b24a-c308-408b-af06-f707e2d0913e', 'B01', 'อาคาร 1', 3, 'สังกัด สถาบันวิจัยและพัฒนา', true, '2026-11-05 03:37:53.124', '2026-11-05 05:48:53.222');
INSERT INTO public."Building" VALUES ('72ae0fa1-1531-4871-ad04-ce918863459b', 'B15', 'อาคาร 15 (อาคารเฉลิมพระเกียรติ 50 พรรษามหาวชิราลงกรณ์)', 9, 'สังกัด สำนักงานอธิการบดี + บัณฑิตวิทยาลัย', true, '2026-11-05 03:37:53.112', '2026-11-05 05:48:53.252');
INSERT INTO public."Building" VALUES ('b9ec4477-f2a8-47e2-b55c-2d7b17b149a2', 'DORM-RP01', 'หอพักราชพฤกษ์ 1', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, '2026-11-05 03:55:50.538', '2026-11-05 05:48:53.306');
INSERT INTO public."Building" VALUES ('2fdf0eec-50bb-4915-8a4e-ca3a1364f365', 'DORM-RP02', 'หอพักราชพฤกษ์ 2', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, '2026-11-05 03:55:50.539', '2026-11-05 05:48:53.308');
INSERT INTO public."Building" VALUES ('a73b5644-038f-48ea-867a-39bfaabe1de9', 'DORM-RP03', 'หอพักราชพฤกษ์ 3', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, '2026-11-05 03:55:50.541', '2026-11-05 05:48:53.312');
INSERT INTO public."Building" VALUES ('5d4f9ce1-818a-4cc8-b757-1a1718e79301', 'DORM-RP04', 'หอพักราชพฤกษ์ 4', 4, 'สังกัด คณะพยาบาลศาสตร์ (หอพักนักศึกษาพยาบาล)', true, '2026-11-05 03:55:50.542', '2026-11-05 05:48:53.315');
INSERT INTO public."Building" VALUES ('3db946ac-f210-4fb1-af62-183306ab3b75', 'DORM-RP06', 'หอพักราชพฤกษ์ 6', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, '2026-11-05 03:55:50.544', '2026-11-05 05:48:53.317');
INSERT INTO public."Building" VALUES ('a2b2e613-2667-45cd-8ee4-5063668c8752', 'DORM-RP07', 'หอพักราชพฤกษ์ 7', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, '2026-11-05 03:55:50.545', '2026-11-05 05:48:53.319');
INSERT INTO public."Building" VALUES ('b6757715-eb93-4f9b-b383-c505f14f7a7e', 'DORM-RP08', 'หอพักราชพฤกษ์ 8', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, '2026-11-05 03:55:50.546', '2026-11-05 05:48:53.322');
INSERT INTO public."Building" VALUES ('f4d963cf-b5dd-46f8-80e2-c23131a206e4', 'DORM-RP09', 'หอพักราชพฤกษ์ 9', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, '2026-11-05 03:55:50.548', '2026-11-05 05:48:53.324');
INSERT INTO public."Building" VALUES ('c06171a9-fe0d-4f00-b84e-ba30e36e5b7a', 'DORM-KA', 'หอพักเขาอังคาร', 4, 'สังกัด กองพัฒนานักศึกษา (หอพักนักศึกษา)', true, '2026-11-05 03:55:50.55', '2026-11-05 05:48:53.326');
INSERT INTO public."Building" VALUES ('966b0fa8-43a1-4c4f-9a9f-2a6a3f95c215', 'DORM-KD', 'หอพักเขากระโดง', 4, 'สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (หอพักบุคลากร)', true, '2026-11-05 03:55:50.551', '2026-11-05 05:48:53.328');
INSERT INTO public."Building" VALUES ('90fc40ad-94f6-4394-9b8b-d1991ec80f13', 'CANTEEN-1', 'ศูนย์อาหาร 1', 2, 'สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (คณะกรรมการศูนย์อาหารตามคำสั่งแต่งตั้งของมหาวิทยาลัย)', true, '2026-11-05 03:55:50.553', '2026-11-05 05:48:53.33');
INSERT INTO public."Building" VALUES ('03fbf7e8-add0-402b-85b4-e3927ec4f95b', 'CANTEEN-2', 'ศูนย์อาหาร 2', 2, 'สังกัด ฝ่ายทรัพย์สินและสิทธิประโยชน์ (คณะกรรมการศูนย์อาหารตามคำสั่งแต่งตั้งของมหาวิทยาลัย)', true, '2026-11-05 03:55:50.554', '2026-11-05 05:48:53.332');
INSERT INTO public."Building" VALUES ('b30a43b3-99c4-408b-955f-3614c0de1148', 'POOL', 'สระว่ายน้ำ (ราชภัฏชลาธาร)', 1, 'คณะกรรมการอาคารสถานกีฬาตามคำสั่งแต่งตั้งของมหาวิทยาลัย', true, '2026-11-05 03:45:46.405', '2026-11-05 05:48:53.334');


--
-- Data for Name: BuildingStaff; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."BuildingStaff" VALUES ('6b7a3b0c-d10b-4112-8c54-2cdfa40aaa6e', '31d1b24a-c308-408b-af06-f707e2d0913e', '3c189b33-18cf-453e-8879-691b170fbf47', 'นาง ประยงค์ นันกลาง', NULL, true, '2026-11-05 05:48:53.228');
INSERT INTO public."BuildingStaff" VALUES ('8ccd620e-1e1a-495c-8e13-3a06f387c22f', 'ed2c1845-059b-4b37-88dc-41dbebf178a5', 'aa1a2ec7-1f50-4eb0-be86-140b3fc7787e', 'จันทร์จิรา เชิดกลิ่น', NULL, true, '2026-11-05 05:48:53.237');
INSERT INTO public."BuildingStaff" VALUES ('33ca1cbb-10d8-4e3b-b12c-a6a9fbcf819e', 'c87dea49-468c-467e-80c4-b3161e76f861', '16e14d00-3476-4296-8c44-c14f7d92f70d', 'ปัทมา ยอนรัมย์', NULL, true, '2026-11-05 05:48:53.24');
INSERT INTO public."BuildingStaff" VALUES ('4358db12-92da-4d2f-b83b-b4a666b618b5', 'ae5b74a2-a766-4b32-9d02-2147d7f43b14', 'f6510fd5-4ff2-4d4b-babd-7ea415ac83cf', 'สุณี เกริงรัมย์', NULL, true, '2026-11-05 05:48:53.243');
INSERT INTO public."BuildingStaff" VALUES ('6c998321-5a95-44e7-884e-8cc0e28cb96f', '0d793dbf-5bf1-4799-82f6-9d0f0494f201', '8d2294b9-0f6c-428e-9e6d-d4cc17f05850', 'นางสาว พิมพ์วลัญช์ เชียงพฤกษ์', NULL, true, '2026-11-05 05:48:53.245');
INSERT INTO public."BuildingStaff" VALUES ('401b79eb-ce8c-4be7-a6f0-7cfe2ac36ed8', '582cbe05-04cb-4585-af38-075fb19844fb', '7b436341-14a1-4266-a324-b63a7e96b5af', 'นาง ตวงลักษณ์ นิลแก้ว', NULL, true, '2026-11-05 05:48:53.248');
INSERT INTO public."BuildingStaff" VALUES ('ff786505-c13c-4f4f-9d20-e435ce3c2392', 'aa6b5228-92f6-4e59-a32b-a20041205ba6', '0d466cd5-79a5-4f3c-b86d-f9ae98e6f7d8', 'นาย พงศ์ศรัณย์ เติมเทียน', NULL, true, '2026-11-05 05:48:53.249');
INSERT INTO public."BuildingStaff" VALUES ('9bcc5a83-1784-4afd-bd60-c7cb00b4b795', 'aa6b5228-92f6-4e59-a32b-a20041205ba6', '4bb399af-aaac-4795-b93b-e48fa271eb2b', 'มะปราง เปาป่า', NULL, false, '2026-11-05 05:48:53.249');
INSERT INTO public."BuildingStaff" VALUES ('644563d1-b7b3-4637-948d-35c91e15178a', 'b3ddecc2-61eb-4c24-ac76-26bb3c7e2d15', '22a2619b-57e5-4f8d-9da2-93560f495eb4', 'นางสาว สุวรรณา ทองสม', NULL, true, '2026-11-05 05:48:53.251');
INSERT INTO public."BuildingStaff" VALUES ('856479e6-2817-4985-a9cf-5fce566dc906', 'e2e48bb4-de09-46fe-a32f-e1d1d973177b', 'fd7c44f6-90da-4b92-903a-9ad7675ea22c', 'มาลี สิงห์คำ', NULL, true, '2026-11-05 05:48:53.252');
INSERT INTO public."BuildingStaff" VALUES ('de051e31-412d-496b-b142-435eff26bde4', '72ae0fa1-1531-4871-ad04-ce918863459b', 'bc67806b-4cac-40e7-98b9-d2d64131a02b', 'นาง บุญมี จันลา', NULL, true, '2026-11-05 05:48:53.254');
INSERT INTO public."BuildingStaff" VALUES ('276b8b99-b174-460e-b921-95a953e30ef5', '72ae0fa1-1531-4871-ad04-ce918863459b', 'e36a94e4-deff-4721-bb09-d1f355915c15', 'นางสาว ธัญญรัศม์ เครืองรัมย์', NULL, false, '2026-11-05 05:48:53.254');
INSERT INTO public."BuildingStaff" VALUES ('64bca0fe-9701-44e6-8eb7-ade6335110d7', '72ae0fa1-1531-4871-ad04-ce918863459b', '72e9a4cf-82fb-4109-8c63-25cc51be4a9d', 'นางสาว พชรภรณ์ ลีประโคน', NULL, false, '2026-11-05 05:48:53.255');
INSERT INTO public."BuildingStaff" VALUES ('561fe003-12e2-4fea-87a6-c5868fb6c1ed', '72ae0fa1-1531-4871-ad04-ce918863459b', 'f90d0109-a40e-4956-9513-e7e24ea130a5', 'นาง รุจิกาญจน์ สิงห์คำ', NULL, false, '2026-11-05 05:48:53.256');
INSERT INTO public."BuildingStaff" VALUES ('39532add-ccfc-4efc-8946-1cc3e0f3ee41', 'f788f6aa-df6d-4494-8e09-065043c3dacc', '000150ea-3be8-44a3-ad0f-20350b08aa79', 'นาง กชพร ชุบรัมย์', NULL, true, '2026-11-05 05:48:53.258');
INSERT INTO public."BuildingStaff" VALUES ('77dd093e-a9a9-4611-ba1a-fe2a4eaf9d7d', '529e2dcc-b0c3-48b8-b66e-ea2ea5a695e9', '223df438-6b07-438b-86ad-af460d5a3911', 'กรวรรณ จันทรภูมิ', NULL, true, '2026-11-05 05:48:53.26');
INSERT INTO public."BuildingStaff" VALUES ('56ed032b-7656-49e8-82c3-2001a5e474bd', '529e2dcc-b0c3-48b8-b66e-ea2ea5a695e9', 'c637a87d-f692-400b-ac2c-800401cdedd6', 'นาง ณัฐชยา ปรีชารัมย์', NULL, false, '2026-11-05 05:48:53.261');
INSERT INTO public."BuildingStaff" VALUES ('935aa4e3-1255-47c0-8d0c-818ff2620cce', '0040679c-c2ad-4a69-9045-91119bce6e59', '1bc16224-f644-4986-a55f-eafbd5de08d2', 'ทองสุข คิดการ', NULL, true, '2026-11-05 05:48:53.263');
INSERT INTO public."BuildingStaff" VALUES ('8eb568bd-9d9d-4401-9e5c-128ba3a34fdd', '0040679c-c2ad-4a69-9045-91119bce6e59', 'b535c9bf-50fc-4a1a-8b8a-c75a8e16e5e7', 'นาง อินทิรา พงกระพันธ์', NULL, false, '2026-11-05 05:48:53.263');
INSERT INTO public."BuildingStaff" VALUES ('12dccb7e-7e9c-491d-9a66-7ec3e3bb4313', 'e4d58f74-4d82-49e1-8373-f8dadbc43289', '1b4cab3f-2c6f-4b1d-9dff-910ee027baa2', 'นาย วุฒิพงษ์ ชำนาญชัยศรี', NULL, true, '2026-11-05 05:48:53.265');
INSERT INTO public."BuildingStaff" VALUES ('ea64dab5-58eb-4f10-b0c8-e01346b624e4', 'e4d58f74-4d82-49e1-8373-f8dadbc43289', 'ff007ea6-9026-4d12-a7d0-64be88c48ee1', 'นางสาว ลลิตา จะเชนรัมย์', NULL, false, '2026-11-05 05:48:53.265');
INSERT INTO public."BuildingStaff" VALUES ('fd24c089-20c9-4462-8293-c61b25a019ce', '83b80602-3275-4b84-94d0-17d6efb2b532', '63abc1e0-a44e-4a24-a471-fd8ac4aca03e', 'นางสาว นงพะงา ปลั่งกลาง', NULL, true, '2026-11-05 05:48:53.266');
INSERT INTO public."BuildingStaff" VALUES ('6c0b723c-3e28-46d1-8b50-b5d3781bf9cf', '83b80602-3275-4b84-94d0-17d6efb2b532', '9c4bcc8b-2b48-4a52-908d-f08354eb432f', 'นางสาว ศิริขวัญ อินัง', NULL, false, '2026-11-05 05:48:53.267');
INSERT INTO public."BuildingStaff" VALUES ('eff04359-3678-4989-87c3-329dc0df3a95', '7934e1d2-518e-4318-85fb-cab18fcbbaa3', '8e955ad3-c7b5-4585-9cca-fcca03ff5f16', 'นางสาว ละเมียด ปลื้มกมล', NULL, true, '2026-11-05 05:48:53.268');
INSERT INTO public."BuildingStaff" VALUES ('c8f894ef-bec5-4eed-8665-e0491f9081ce', '734b53d7-59d0-471d-bfe2-b6289c7cb2d5', NULL, 'นางสาวศุภิสรา รอบแคว้น', NULL, true, '2026-11-05 05:48:53.269');
INSERT INTO public."BuildingStaff" VALUES ('0d92f594-e880-4566-9e43-bc51806b4398', '734b53d7-59d0-471d-bfe2-b6289c7cb2d5', '634059fb-9b7b-4498-9de5-09358b5ceb99', 'นางสาว ราตรี คำบาง', NULL, false, '2026-11-05 05:48:53.27');
INSERT INTO public."BuildingStaff" VALUES ('6b8a1dba-5c39-4484-8f7f-aca73f4705e5', '25e688a8-5df2-4079-b0dc-3af537877f9a', '346996a6-428f-40d1-a8d0-237e0f5a0b3c', 'อำนวย คงชู', NULL, true, '2026-11-05 05:48:53.271');
INSERT INTO public."BuildingStaff" VALUES ('d43c39dd-9110-49d6-97b0-9d59d894430d', '25e688a8-5df2-4079-b0dc-3af537877f9a', '677a7781-3d96-42f9-81c5-b1959ca33f53', 'นาย สมชาย สว่างพบ', NULL, false, '2026-11-05 05:48:53.272');
INSERT INTO public."BuildingStaff" VALUES ('3624ad95-0bd4-4e53-ae33-9fcd7f31e09b', '4b04657f-a7d1-48bd-b803-303ef8fa1541', 'b4bb78bf-3ba6-46eb-a893-e789eba011cb', 'นาง ณิสาชล คะรุรัมย์', NULL, true, '2026-11-05 05:48:53.274');
INSERT INTO public."BuildingStaff" VALUES ('fa2adeb1-f027-4ea3-b394-0181d9c6eec7', '4b04657f-a7d1-48bd-b803-303ef8fa1541', '45959002-1e06-4e55-a8e9-395b02a1c32f', 'นางสาว วาสนา กรีรัมย์', NULL, false, '2026-11-05 05:48:53.275');
INSERT INTO public."BuildingStaff" VALUES ('2fbc8ae1-630e-4897-9e8a-131eed4a1010', '8bd0c52a-c2da-44a4-a507-b0b08f03b20f', 'facd0a93-ac05-4598-b159-c70a198de095', 'พรรณี สวายรัมย์', NULL, true, '2026-11-05 05:48:53.278');
INSERT INTO public."BuildingStaff" VALUES ('17f12ebb-cea5-4cad-b872-661d86590e39', '8bd0c52a-c2da-44a4-a507-b0b08f03b20f', 'f9d3df05-c6b9-4b5d-a788-1f65665c6879', 'วันทนีย์ ประสูติธนกิตติ์', NULL, false, '2026-11-05 05:48:53.279');
INSERT INTO public."BuildingStaff" VALUES ('35730c8e-778f-4856-89f5-ac98a404ff47', '9d340188-149a-47c6-b135-9ac5165c4689', '8e955ad3-c7b5-4585-9cca-fcca03ff5f16', 'นางสาว ละเมียด ปลื้มกมล', NULL, true, '2026-11-05 05:48:53.283');
INSERT INTO public."BuildingStaff" VALUES ('e37c8bc7-3f43-4855-8510-8d7516b1da93', 'b67576c0-4284-48d0-a1fd-acdfb3a39d54', '9a54758f-2c17-4b91-8d88-756957d6aedd', 'นางสาว สุภาภรณ์ ชะโลมรัมย์', NULL, true, '2026-11-05 05:48:53.285');
INSERT INTO public."BuildingStaff" VALUES ('1cce249d-f906-404c-9338-024f081a1f22', 'e135cd6d-bc80-4ef5-9596-538ecc47296b', 'b2186417-abf1-41ee-8311-b2d9ba2151c8', 'นางสาว กันตินันท์ เอกา', NULL, true, '2026-11-05 05:48:53.288');
INSERT INTO public."BuildingStaff" VALUES ('380f78b6-aaa9-4f02-8581-5beb204a4427', 'd9767a01-0718-4526-9aa2-19ba05a8368c', '93426701-adf3-43bc-a61c-d8cc65abc3ab', 'นาย วุฒิชัย มะลิรัมย์', NULL, true, '2026-11-05 05:48:53.289');
INSERT INTO public."BuildingStaff" VALUES ('cee36c6f-325b-4786-a96c-2016f5bde055', 'f1a88782-4f3a-4655-b7c5-3a4ed1ec2fd1', '55fbb229-9d63-44c5-a868-d715825df9c7', 'จุฑาทิพย์ อีนัง', NULL, true, '2026-11-05 05:48:53.29');
INSERT INTO public."BuildingStaff" VALUES ('20538c49-41ee-484f-a9e3-5a8399a1a1e3', '20fe781e-e11c-40d7-8611-a9c3041e713c', 'c864e006-fd80-403d-a606-5f77b99bcfd6', 'นาย สุรชัย ตามกลาง', NULL, true, '2026-11-05 05:48:53.291');
INSERT INTO public."BuildingStaff" VALUES ('a1c1aed3-9081-4099-b9dd-1223ae44520c', 'cbbc95ec-f199-43a1-9251-9d56c76f3c19', '021c1f9d-3e60-4d78-8552-fef53daee902', 'ญาณวรุตม์ พันธุ์ขุนแก้ว', NULL, true, '2026-11-05 05:48:53.293');
INSERT INTO public."BuildingStaff" VALUES ('e4565071-ebbd-4a20-970b-75cbd1c3da99', 'cbbc95ec-f199-43a1-9251-9d56c76f3c19', 'c67fe412-0f81-4aae-891a-2c1ae6148984', 'บุญมี ปัตแวว', NULL, false, '2026-11-05 05:48:53.294');
INSERT INTO public."BuildingStaff" VALUES ('1a69a4c3-4cdb-433a-8113-586906f8a854', 'cbbc95ec-f199-43a1-9251-9d56c76f3c19', '84f68217-42a8-44e1-918f-29187c08b73b', 'พัชรา พะสุรัมย์', NULL, false, '2026-11-05 05:48:53.295');
INSERT INTO public."BuildingStaff" VALUES ('d9c2c01a-c5a6-41b0-af5a-5dc9c821b694', '14e0a11b-a4b9-4687-b60f-0a97b6f1d87a', '8afddff0-2367-434e-9d77-8afa13b1dc57', 'นาย ทองพูน ธรรมสาลี', NULL, true, '2026-11-05 05:48:53.298');
INSERT INTO public."BuildingStaff" VALUES ('7f2fd072-eb45-41c3-ba66-0bee7cdd0a22', '9f814059-ae61-4756-8bc4-d7e8595a9956', '8afddff0-2367-434e-9d77-8afa13b1dc57', 'นาย ทองพูน ธรรมสาลี', NULL, true, '2026-11-05 05:48:53.3');
INSERT INTO public."BuildingStaff" VALUES ('2a4b0fdc-7a8d-453e-8d38-f71312055412', '467c76f8-8007-4e82-a4e7-0799deb929cc', 'de1dc0eb-54f5-4b05-ad14-fec4131a4429', 'นาง ณิชาภา นามวัน', NULL, true, '2026-11-05 05:48:53.302');
INSERT INTO public."BuildingStaff" VALUES ('00906ba4-7535-48ba-95b9-27b7f7515b04', '8b16bf09-ebbc-4159-836a-b8dde54ca425', '63de95f1-a75f-4fb4-9396-034a8a0f8686', 'นางสาว เสาวลักษณ์ กอนรัมย์', NULL, true, '2026-11-05 05:48:53.305');
INSERT INTO public."BuildingStaff" VALUES ('1dfbf42a-bfdb-4d31-aa01-7ca5ce10ac2a', 'b9ec4477-f2a8-47e2-b55c-2d7b17b149a2', '1c6577b5-d084-47b7-aaa9-be018ec6ab1d', 'นาง นวน ระตาภรณ์', NULL, true, '2026-11-05 05:48:53.307');
INSERT INTO public."BuildingStaff" VALUES ('b0937759-961d-4151-8123-beb306b47548', '2fdf0eec-50bb-4915-8a4e-ca3a1364f365', 'aecbee6a-7796-4adb-a71a-1b3ec5209cc4', 'ศรสวรรค์ เดยังรัมย์', NULL, true, '2026-11-05 05:48:53.311');
INSERT INTO public."BuildingStaff" VALUES ('210ee02c-4413-44d8-b2d9-66f6b94ced95', 'a73b5644-038f-48ea-867a-39bfaabe1de9', '1c6577b5-d084-47b7-aaa9-be018ec6ab1d', 'นาง นวน ระตาภรณ์', NULL, true, '2026-11-05 05:48:53.314');
INSERT INTO public."BuildingStaff" VALUES ('77929af7-5dc4-47bc-bafb-963c92b671d2', '5d4f9ce1-818a-4cc8-b757-1a1718e79301', 'aecbee6a-7796-4adb-a71a-1b3ec5209cc4', 'ศรสวรรค์ เดยังรัมย์', NULL, true, '2026-11-05 05:48:53.316');
INSERT INTO public."BuildingStaff" VALUES ('de53177f-c098-41e0-8736-7e9975eb1e6b', '3db946ac-f210-4fb1-af62-183306ab3b75', '1c115ab8-71e0-4a5f-9dba-937d5fdd69ba', 'นางสาว นงนุช หนาวบุรีรัมย์', NULL, true, '2026-11-05 05:48:53.319');
INSERT INTO public."BuildingStaff" VALUES ('cf13e3c5-a368-403b-90df-5f46cbdb9111', 'a2b2e613-2667-45cd-8ee4-5063668c8752', '1c115ab8-71e0-4a5f-9dba-937d5fdd69ba', 'นางสาว นงนุช หนาวบุรีรัมย์', NULL, true, '2026-11-05 05:48:53.321');
INSERT INTO public."BuildingStaff" VALUES ('c9824949-ea6b-499e-a0df-ba1722dd642c', 'b6757715-eb93-4f9b-b383-c505f14f7a7e', '957f22e1-5e9e-4677-b84e-9a0903969348', 'จรรยา เจียนรัมย์', NULL, true, '2026-11-05 05:48:53.323');
INSERT INTO public."BuildingStaff" VALUES ('9ff86c66-0f69-420b-a931-1de8f0654ac5', 'f4d963cf-b5dd-46f8-80e2-c23131a206e4', '957f22e1-5e9e-4677-b84e-9a0903969348', 'จรรยา เจียนรัมย์', NULL, true, '2026-11-05 05:48:53.325');
INSERT INTO public."BuildingStaff" VALUES ('0e31bcce-db8a-4014-92d5-1ae021283c01', 'c06171a9-fe0d-4f00-b84e-ba30e36e5b7a', '55a006ee-f8e9-41a6-8540-106bbc447c5e', 'นาง พรพรรณ คำใจ', NULL, true, '2026-11-05 05:48:53.327');
INSERT INTO public."BuildingStaff" VALUES ('3d6e8c96-4004-4050-acaa-f621fd368b56', '966b0fa8-43a1-4c4f-9a9f-2a6a3f95c215', '55a006ee-f8e9-41a6-8540-106bbc447c5e', 'นาง พรพรรณ คำใจ', NULL, true, '2026-11-05 05:48:53.329');
INSERT INTO public."BuildingStaff" VALUES ('8c052a77-043a-467c-8508-ad0cd250872d', '90fc40ad-94f6-4394-9b8b-d1991ec80f13', 'd8f28b02-8066-4d23-a26a-1f73c2dd3150', 'นาย พรชัย มาลัยทอง', NULL, true, '2026-11-05 05:48:53.331');
INSERT INTO public."BuildingStaff" VALUES ('0c42e17c-6886-49dc-9009-2712df7067ce', '03fbf7e8-add0-402b-85b4-e3927ec4f95b', 'd8f28b02-8066-4d23-a26a-1f73c2dd3150', 'นาย พรชัย มาลัยทอง', NULL, true, '2026-11-05 05:48:53.333');
INSERT INTO public."BuildingStaff" VALUES ('976098cf-2463-4b2f-b649-3c09defbca2f', 'b30a43b3-99c4-408b-955f-3614c0de1148', NULL, 'นายวรุฒิพงษ์ สิริวัฒนธีรกุล', NULL, true, '2026-11-05 05:48:53.335');


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Category" VALUES (1, 'หมวดที่ 1 ความสะอาดภายในอาคาร', 1);
INSERT INTO public."Category" VALUES (2, 'หมวดที่ 2 ห้องเรียน ห้องประชุม และสำนักงาน', 2);
INSERT INTO public."Category" VALUES (3, 'หมวดที่ 3 ห้องน้ำและการจัดการขยะ', 3);
INSERT INTO public."Category" VALUES (4, 'หมวดที่ 4 การจัดเก็บอุปกรณ์และครุภัณฑ์', 4);
INSERT INTO public."Category" VALUES (5, 'หมวดที่ 5 ความสะอาดภายนอกอาคารและการดูแลพื้นที่สีเขียว', 5);
INSERT INTO public."Category" VALUES (6, 'หมวดที่ 6 ความปลอดภัย ความรับผิดชอบ และจิตสาธารณะ', 6);
INSERT INTO public."Category" VALUES (7, 'หมวดที่ 7 อื่น ๆ', 7);


--
-- Data for Name: EvaluationRound; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."EvaluationRound" VALUES ('round-2570', 'รอบการประเมินประจำปีงบประมาณ 2569', '2570', '', '2026-10-01', '2027-09-30', 'OPEN', '2026-11-05 03:37:53.132', '2026-11-05 04:29:12.21');


--
-- Data for Name: FindingAttachment; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: QuestionItem; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."QuestionItem" VALUES (2, 1, 2, 'ราวบันได ลูกกรง ขอบบันได และราวจับสะอาด ไม่มีฝุ่นสะสม', 5);
INSERT INTO public."QuestionItem" VALUES (3, 1, 3, 'ซอกมุม ใต้โต๊ะ ใต้เก้าอี้ หลังตู้ และมุมอับสะอาด ไม่มีฝุ่นหรือหยากไย่', 5);
INSERT INTO public."QuestionItem" VALUES (4, 1, 4, 'ประตู มือจับประตู ขอบหน้าต่าง และวงกบสะอาด ไม่มีคราบสกปรก', 5);
INSERT INTO public."QuestionItem" VALUES (5, 1, 5, 'กระจกและหน้าต่างใสสะอาด ไม่มีฝุ่น คราบมือ หรือคราบน้ำ', 5);
INSERT INTO public."QuestionItem" VALUES (6, 2, 6, 'โต๊ะเรียน โต๊ะทำงาน และโต๊ะประชุมสะอาด ไม่มีฝุ่นหรือคราบสกปรก', 5);
INSERT INTO public."QuestionItem" VALUES (7, 2, 7, 'เก้าอี้เรียนและเก้าอี้สำนักงานสะอาด จัดวางเป็นระเบียบ', 5);
INSERT INTO public."QuestionItem" VALUES (8, 2, 8, 'ห้องเรียนสะอาดเรียบร้อย พื้นและบริเวณโดยรอบพร้อมใช้งาน', 5);
INSERT INTO public."QuestionItem" VALUES (9, 2, 9, 'ห้องประชุมสะอาดเรียบร้อย โต๊ะ เก้าอี้ และพื้นที่โดยรอบพร้อมใช้งาน', 5);
INSERT INTO public."QuestionItem" VALUES (10, 2, 10, 'ห้องสำนักงานและพื้นที่ส่วนกลางสะอาด ไม่มีสิ่งของวางเกะกะ', 5);
INSERT INTO public."QuestionItem" VALUES (12, 3, 12, 'พื้นห้องน้ำ โถสุขภัณฑ์ โถปัสสาวะ และอ่างล้างมือสะอาด', 5);
INSERT INTO public."QuestionItem" VALUES (13, 3, 13, 'กระจกห้องน้ำ ก๊อกน้ำ และสุขภัณฑ์ไม่มีคราบสกปรกสะสม', 5);
INSERT INTO public."QuestionItem" VALUES (14, 3, 14, 'ห้องน้ำไม่มีกลิ่นไม่พึงประสงค์ ถังขยะไม่ล้น และพื้นห้องน้ำไม่มีน้ำขัง', 5);
INSERT INTO public."QuestionItem" VALUES (15, 3, 15, 'ถังขยะได้รับการจัดการตามรอบเวลา ไม่มีขยะตกหล่นหรือส่งกลิ่นรบกวน', 5);
INSERT INTO public."QuestionItem" VALUES (16, 4, 16, 'ตู้เก็บอุปกรณ์ ชั้นวางของ และอุปกรณ์ทำความสะอาดสะอาด จัดเก็บเป็นระเบียบ', 5);
INSERT INTO public."QuestionItem" VALUES (17, 4, 17, 'โต๊ะ เก้าอี้ หรือครุภัณฑ์ที่วางกองในพื้นที่ส่วนกลางได้รับการจัดระเบียบ หรือแจ้งผู้รับผิดชอบ', 5);
INSERT INTO public."QuestionItem" VALUES (18, 4, 18, 'ครุภัณฑ์ชำรุดหรือไม่ใช้งานได้รับการรายงานหน่วยงานพัสดุหรือผู้รับผิดชอบเพื่อพิจารณาดำเนินการ', 5);
INSERT INTO public."QuestionItem" VALUES (19, 4, 19, 'กระถางต้นไม้ กระถางดอกไม้ และของตกแต่งอาคารสะอาด ไม่มีฝุ่นสะสม', 5);
INSERT INTO public."QuestionItem" VALUES (20, 5, 20, 'พื้นที่หน้าอาคารและทางเข้าอาคารสะอาด ไม่มีเศษขยะหรือสิ่งของวางเกะกะ', 5);
INSERT INTO public."QuestionItem" VALUES (21, 5, 21, 'พื้นที่ด้านหลังอาคารและบริเวณโดยรอบสะอาด ปราศจากเศษขยะ และจัดเก็บสิ่งของเป็นระเบียบ', 5);
INSERT INTO public."QuestionItem" VALUES (22, 5, 22, 'ทางเดินภายนอก ลานกิจกรรม และบันไดภายนอกสะอาด ปราศจากเศษขยะและสิ่งกีดขวาง พร้อมใช้งานอย่างปลอดภัย', 5);
INSERT INTO public."QuestionItem" VALUES (23, 5, 23, 'กวาดเก็บใบไม้แห้ง กิ่งไม้ และเศษวัสดุในพื้นที่รับผิดชอบให้สะอาดเรียบร้อยอยู่เสมอ', 5);
INSERT INTO public."QuestionItem" VALUES (24, 5, 24, 'รดน้ำต้นไม้และไม้ประดับตามความเหมาะสมและตามหน้าที่ที่ได้รับมอบหมาย เพื่อให้ต้นไม้มีความสดชื่นและอยู่ในสภาพดี', 5);
INSERT INTO public."QuestionItem" VALUES (25, 5, 25, 'ดูแลต้นไม้และพื้นที่สีเขียวในบริเวณที่รับผิดชอบให้เรียบร้อย เก็บใบไม้แห้ง และตัดแต่งตามความเหมาะสมและขอบเขตหน้าที่ที่ได้รับมอบหมาย', 5);
INSERT INTO public."QuestionItem" VALUES (26, 6, 26, 'บริเวณท่อระบายน้ำและจุดเสี่ยงน้ำขังสะอาด ปราศจากเศษขยะสะสม และแจ้งปัญหาที่เกินขอบเขตหน้าที่ให้ผู้เกี่ยวข้องทราบโดยเร็ว เพื่อดำเนินการแก้ไขอย่างเหมาะสม', 5);
INSERT INTO public."QuestionItem" VALUES (27, 6, 27, 'ทางเดินและทางหนีไฟสะอาด ปราศจากสิ่งกีดขวาง พร้อมใช้งานอยู่เสมอ และรายงานสิ่งผิดปกติที่พบให้ผู้เกี่ยวข้องทราบโดยเร็ว', 5);
INSERT INTO public."QuestionItem" VALUES (28, 6, 28, 'ดูแลรักษาความสะอาดในพื้นที่รับผิดชอบระหว่างปฏิบัติงาน และเก็บขยะหรือทำความสะอาดสิ่งสกปรกทันทีที่พบ', 5);
INSERT INTO public."QuestionItem" VALUES (29, 6, 29, 'ตรวจสอบความเรียบร้อยหลังทำความสะอาด และแก้ไขข้อบกพร่องที่พบหรือได้รับแจ้งภายในเวลาที่เหมาะสม', 5);
INSERT INTO public."QuestionItem" VALUES (1, 1, 1, 'พื้นอาคาร ทางเดิน และโถงอาคารสะอาด ไม่มีฝุ่น เศษขยะ หรือคราบสกปรก', 5);
INSERT INTO public."QuestionItem" VALUES (11, 2, 11, 'กระดานเขียนหน้าห้องเรียนและพื้นผิวหรืออุปกรณ์ที่อยู่ในขอบเขตงานทำความสะอาดมีความสะอาดเรียบร้อย', 5);
INSERT INTO public."QuestionItem" VALUES (30, 6, 30, 'ดูแลอาคารด้วยความรับผิดชอบและมีจิตสาธารณะอย่างสม่ำเสมอ พร้อมรายงานปัญหาที่พบให้ผู้เกี่ยวข้องทราบเพื่อดำเนินการแก้ไขอย่างเหมาะสม', 5);
INSERT INTO public."QuestionItem" VALUES (31, 7, 31, 'มีป้ายแสดงรายละเอียดแม่บ้านประจำอาคารติดตั้งในบริเวณที่มองเห็นได้ชัดเจน โดยมีข้อมูลครบถ้วนและเป็นปัจจุบัน', 5);
INSERT INTO public."QuestionItem" VALUES (32, 7, 32, 'ดูแลป้ายแสดงรายละเอียดที่ส่วนกลางจัดทำและติดตั้งในพื้นที่รับผิดชอบให้มีสภาพเรียบร้อย มองเห็นได้ชัดเจน และมีรายละเอียดครบถ้วนเป็นปัจจุบัน', 5);
INSERT INTO public."QuestionItem" VALUES (33, 7, 33, 'ทำงานร่วมกับเพื่อนร่วมงานเป็นทีม มีน้ำใจช่วยเหลือซึ่งกันและกัน และมีความเสียสละเพื่อประโยชน์ส่วนรวม', 5);
INSERT INTO public."QuestionItem" VALUES (34, 7, 34, 'ปฏิบัติตามนโยบาย ระเบียบ และแนวทางการดำเนินงานของมหาวิทยาลัยอย่างเคร่งครัดและสม่ำเสมอ', 5);
INSERT INTO public."QuestionItem" VALUES (35, 7, 35, 'แต่งกายสุภาพ เรียบร้อย สะอาด ไม่มีกลิ่นไม่พึงประสงค์ และมีความพร้อมในการปฏิบัติหน้าที่อยู่เสมอ', 5);


--
-- Data for Name: ScoreItem; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: SystemSetting; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."SystemSetting" VALUES ('criteria_building', '{"greenMin":4,"yellowMin":2,"greenLabel":"ดีเยี่ยม / ผ่านเกณฑ์มาตรฐาน","yellowLabel":"ปานกลาง / เฝ้าระวัง","redLabel":"ต้องปรับปรุงเร่งด่วน"}', '2026-11-05 05:49:34.649');
INSERT INTO public."SystemSetting" VALUES ('criteria_staff', '{"greenMin":4,"yellowMin":2,"greenLabel":"ดีเยี่ยม / ผลงานดีเด่น","yellowLabel":"ปานกลาง / พอใช้","redLabel":"ต้องปรับปรุงเร่งด่วน"}', '2026-11-05 05:49:34.65');


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" VALUES ('199d8a03-d67a-43fb-a6b5-e8cb2f1c1040', 'admin', 'ผู้ดูแลระบบ อาคารสถานที่', 'admin@bru.ac.th', 'ADMIN', NULL, 'ผู้ดูแลระบบ', NULL, '2026-11-05 03:37:53.126', '2026-11-05 03:45:10.631');
INSERT INTO public."User" VALUES ('0d7cd6cc-32cb-46d5-a6f9-3d7143f828d6', '900522', 'ผู้ช่วยศาสตราจารย์ ดร. พิทยา พันธะไชย', '900522@bru.ac.th', 'AUDITOR', '79', 'รองประธานกรรมการ', NULL, '2026-11-05 04:30:03.471', '2026-11-05 05:51:36.11');
INSERT INTO public."User" VALUES ('ea9464ab-faf5-41c0-9545-1ea1d41241e0', '100080', 'ผู้ช่วยศาสตราจารย์ ดร. สมศักดิ์ จีวัฒนา', '100080@bru.ac.th', 'AUDITOR', '118', 'กรรมการ', NULL, '2026-11-05 04:29:57.546', '2026-11-05 05:51:36.123');
INSERT INTO public."User" VALUES ('8d2294b9-0f6c-428e-9e6d-d4cc17f05850', '4300016', 'นางสาว พิมพ์วลัญช์ เชียงพฤกษ์', '4300016@bru.ac.th', 'AUDITOR', '40', 'กรรมการและผู้ช่วยเลขานุการ', NULL, '2026-11-05 05:48:53.17', '2026-11-05 05:51:36.128');
INSERT INTO public."User" VALUES ('04656b16-c2bc-48d9-a917-9c2d6b2523ff', '500284', 'อาจารย์ ดร. ชาติวุฒิ ธนาจิรันธร', '500284@bru.ac.th', 'AUDITOR', '102', 'บุคลากรมหาวิทยาลัย', NULL, '2026-11-05 04:30:33.114', '2026-11-05 04:30:40.068');
INSERT INTO public."User" VALUES ('3c189b33-18cf-453e-8879-691b170fbf47', '5500056', 'นาง ประยงค์ นันกลาง', '5500056@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.155', '2026-11-05 05:48:53.155');
INSERT INTO public."User" VALUES ('aa1a2ec7-1f50-4eb0-be86-140b3fc7787e', '6900004', 'จันทร์จิรา เชิดกลิ่น', '6900004@bru.ac.th', 'HOUSEKEEPER', '1', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.166', '2026-11-05 05:48:53.166');
INSERT INTO public."User" VALUES ('16e14d00-3476-4296-8c44-c14f7d92f70d', '6900005', 'ปัทมา ยอนรัมย์', '6900005@bru.ac.th', 'HOUSEKEEPER', '1', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.167', '2026-11-05 05:48:53.167');
INSERT INTO public."User" VALUES ('f6510fd5-4ff2-4d4b-babd-7ea415ac83cf', '6500016', 'สุณี เกริงรัมย์', '6500016@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.169', '2026-11-05 05:48:53.169');
INSERT INTO public."User" VALUES ('7b436341-14a1-4266-a324-b63a7e96b5af', '600083', 'นาง ตวงลักษณ์ นิลแก้ว', '600083@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.17', '2026-11-05 05:48:53.17');
INSERT INTO public."User" VALUES ('0d466cd5-79a5-4f3c-b86d-f9ae98e6f7d8', '660427', 'นาย พงศ์ศรัณย์ เติมเทียน', '660427@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.172', '2026-11-05 05:48:53.172');
INSERT INTO public."User" VALUES ('4bb399af-aaac-4795-b93b-e48fa271eb2b', '6700009', 'มะปราง เปาป่า', '6700009@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.173', '2026-11-05 05:48:53.173');
INSERT INTO public."User" VALUES ('22a2619b-57e5-4f8d-9da2-93560f495eb4', '6400013', 'นางสาว สุวรรณา ทองสม', '6400013@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.173', '2026-11-05 05:48:53.173');
INSERT INTO public."User" VALUES ('fd7c44f6-90da-4b92-903a-9ad7675ea22c', '6700002', 'มาลี สิงห์คำ', '6700002@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.175', '2026-11-05 05:48:53.175');
INSERT INTO public."User" VALUES ('bc67806b-4cac-40e7-98b9-d2d64131a02b', '4200008', 'นาง บุญมี จันลา', '4200008@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.176', '2026-11-05 05:48:53.176');
INSERT INTO public."User" VALUES ('e36a94e4-deff-4721-bb09-d1f355915c15', '660491', 'นางสาว ธัญญรัศม์ เครืองรัมย์', '660491@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.177', '2026-11-05 05:48:53.177');
INSERT INTO public."User" VALUES ('72e9a4cf-82fb-4109-8c63-25cc51be4a9d', '6200027', 'นางสาว พชรภรณ์ ลีประโคน', '6200027@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.178', '2026-11-05 05:48:53.178');
INSERT INTO public."User" VALUES ('f90d0109-a40e-4956-9513-e7e24ea130a5', '660141', 'นาง รุจิกาญจน์ สิงห์คำ', '660141@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.179', '2026-11-05 05:48:53.179');
INSERT INTO public."User" VALUES ('000150ea-3be8-44a3-ad0f-20350b08aa79', '4200009', 'นาง กชพร ชุบรัมย์', '4200009@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.181', '2026-11-05 05:48:53.181');
INSERT INTO public."User" VALUES ('223df438-6b07-438b-86ad-af460d5a3911', '600079', 'กรวรรณ จันทรภูมิ', '600079@bru.ac.th', 'HOUSEKEEPER', '65', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.181', '2026-11-05 05:48:53.181');
INSERT INTO public."User" VALUES ('c637a87d-f692-400b-ac2c-800401cdedd6', '600082', 'นาง ณัฐชยา ปรีชารัมย์', '600082@bru.ac.th', 'HOUSEKEEPER', '66', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.184', '2026-11-05 05:48:53.184');
INSERT INTO public."User" VALUES ('1bc16224-f644-4986-a55f-eafbd5de08d2', '5300049', 'ทองสุข คิดการ', '5300049@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.185', '2026-11-05 05:48:53.185');
INSERT INTO public."User" VALUES ('b535c9bf-50fc-4a1a-8b8a-c75a8e16e5e7', '5800009', 'นาง อินทิรา พงกระพันธ์', '5800009@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.186', '2026-11-05 05:48:53.186');
INSERT INTO public."User" VALUES ('1b4cab3f-2c6f-4b1d-9dff-910ee027baa2', '5000042', 'นาย วุฒิพงษ์ ชำนาญชัยศรี', '5000042@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.187', '2026-11-05 05:48:53.187');
INSERT INTO public."User" VALUES ('ff007ea6-9026-4d12-a7d0-64be88c48ee1', '660267', 'นางสาว ลลิตา จะเชนรัมย์', '660267@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.188', '2026-11-05 05:48:53.188');
INSERT INTO public."User" VALUES ('63abc1e0-a44e-4a24-a471-fd8ac4aca03e', '600072', 'นางสาว นงพะงา ปลั่งกลาง', '600072@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.189', '2026-11-05 05:48:53.189');
INSERT INTO public."User" VALUES ('9c4bcc8b-2b48-4a52-908d-f08354eb432f', '600077', 'นางสาว ศิริขวัญ อินัง', '600077@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.19', '2026-11-05 05:48:53.19');
INSERT INTO public."User" VALUES ('8e955ad3-c7b5-4585-9cca-fcca03ff5f16', '600076', 'นางสาว ละเมียด ปลื้มกมล', '600076@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.191', '2026-11-05 05:48:53.191');
INSERT INTO public."User" VALUES ('634059fb-9b7b-4498-9de5-09358b5ceb99', '660169', 'นางสาว ราตรี คำบาง', '660169@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.192', '2026-11-05 05:48:53.192');
INSERT INTO public."User" VALUES ('346996a6-428f-40d1-a8d0-237e0f5a0b3c', '6200010', 'อำนวย คงชู', '6200010@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.194', '2026-11-05 05:48:53.194');
INSERT INTO public."User" VALUES ('677a7781-3d96-42f9-81c5-b1959ca33f53', '660201', 'นาย สมชาย สว่างพบ', '660201@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.195', '2026-11-05 05:48:53.195');
INSERT INTO public."User" VALUES ('b4bb78bf-3ba6-46eb-a893-e789eba011cb', '600102', 'นาง ณิสาชล คะรุรัมย์', '600102@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.196', '2026-11-05 05:48:53.196');
INSERT INTO public."User" VALUES ('45959002-1e06-4e55-a8e9-395b02a1c32f', '6300037', 'นางสาว วาสนา กรีรัมย์', '6300037@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.197', '2026-11-05 05:48:53.197');
INSERT INTO public."User" VALUES ('facd0a93-ac05-4598-b159-c70a198de095', '5000035', 'พรรณี สวายรัมย์', '5000035@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.198', '2026-11-05 05:48:53.198');
INSERT INTO public."User" VALUES ('f9d3df05-c6b9-4b5d-a788-1f65665c6879', '6200009', 'วันทนีย์ ประสูติธนกิตติ์', '6200009@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.2', '2026-11-05 05:48:53.2');
INSERT INTO public."User" VALUES ('9a54758f-2c17-4b91-8d88-756957d6aedd', '5600017', 'นางสาว สุภาภรณ์ ชะโลมรัมย์', '5600017@bru.ac.th', 'HOUSEKEEPER', '86', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.201', '2026-11-05 05:48:53.201');
INSERT INTO public."User" VALUES ('b2186417-abf1-41ee-8311-b2d9ba2151c8', '600078', 'นางสาว กันตินันท์ เอกา', '600078@bru.ac.th', 'HOUSEKEEPER', '65', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.202', '2026-11-05 05:48:53.202');
INSERT INTO public."User" VALUES ('93426701-adf3-43bc-a61c-d8cc65abc3ab', '660065', 'นาย วุฒิชัย มะลิรัมย์', '660065@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.203', '2026-11-05 05:48:53.203');
INSERT INTO public."User" VALUES ('55fbb229-9d63-44c5-a868-d715825df9c7', '6700015', 'จุฑาทิพย์ อีนัง', '6700015@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.205', '2026-11-05 05:48:53.205');
INSERT INTO public."User" VALUES ('c864e006-fd80-403d-a606-5f77b99bcfd6', '5300005', 'นาย สุรชัย ตามกลาง', '5300005@bru.ac.th', 'AUDITOR', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.206', '2026-11-05 05:48:53.206');
INSERT INTO public."User" VALUES ('021c1f9d-3e60-4d78-8552-fef53daee902', '6800017', 'ญาณวรุตม์ พันธุ์ขุนแก้ว', '6800017@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.207', '2026-11-05 05:48:53.207');
INSERT INTO public."User" VALUES ('c67fe412-0f81-4aae-891a-2c1ae6148984', '6800016', 'บุญมี ปัตแวว', '6800016@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.209', '2026-11-05 05:48:53.209');
INSERT INTO public."User" VALUES ('84f68217-42a8-44e1-918f-29187c08b73b', '6800024', 'พัชรา พะสุรัมย์', '6800024@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.21', '2026-11-05 05:48:53.21');
INSERT INTO public."User" VALUES ('8afddff0-2367-434e-9d77-8afa13b1dc57', '660269', 'นาย ทองพูน ธรรมสาลี', '660269@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.211', '2026-11-05 05:48:53.211');
INSERT INTO public."User" VALUES ('de1dc0eb-54f5-4b05-ad14-fec4131a4429', '6300025', 'นาง ณิชาภา นามวัน', '6300025@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.212', '2026-11-05 05:48:53.212');
INSERT INTO public."User" VALUES ('63de95f1-a75f-4fb4-9396-034a8a0f8686', '660442', 'นางสาว เสาวลักษณ์ กอนรัมย์', '660442@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.213', '2026-11-05 05:48:53.213');
INSERT INTO public."User" VALUES ('1c6577b5-d084-47b7-aaa9-be018ec6ab1d', '660436', 'นาง นวน ระตาภรณ์', '660436@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.214', '2026-11-05 05:48:53.214');
INSERT INTO public."User" VALUES ('aecbee6a-7796-4adb-a71a-1b3ec5209cc4', '6600001', 'ศรสวรรค์ เดยังรัมย์', '6600001@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.215', '2026-11-05 05:48:53.215');
INSERT INTO public."User" VALUES ('1c115ab8-71e0-4a5f-9dba-937d5fdd69ba', '5900034', 'นางสาว นงนุช หนาวบุรีรัมย์', '5900034@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.216', '2026-11-05 05:48:53.216');
INSERT INTO public."User" VALUES ('957f22e1-5e9e-4677-b84e-9a0903969348', '6800012', 'จรรยา เจียนรัมย์', '6800012@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.218', '2026-11-05 05:48:53.218');
INSERT INTO public."User" VALUES ('55a006ee-f8e9-41a6-8540-106bbc447c5e', '4700026', 'นาง พรพรรณ คำใจ', '4700026@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.219', '2026-11-05 05:48:53.219');
INSERT INTO public."User" VALUES ('d8f28b02-8066-4d23-a26a-1f73c2dd3150', '660420', 'นาย พรชัย มาลัยทอง', '660420@bru.ac.th', 'HOUSEKEEPER', '40', 'พนักงานบริการประจำอาคาร (แม่บ้าน)', NULL, '2026-11-05 05:48:53.22', '2026-11-05 05:48:53.22');
INSERT INTO public."User" VALUES ('18a26fe5-252b-4b1d-bf14-6bda2cda824e', '100174', 'รองศาสตราจารย์ ดร. ศิราณี จุโฑปะมา', '100174@bru.ac.th', 'AUDITOR', '79', 'ประธานกรรมการ', NULL, '2026-11-05 05:51:36.101', '2026-11-05 05:51:36.101');
INSERT INTO public."User" VALUES ('20e1c934-8381-4bda-8442-c1234e658e3a', '100196', 'รองศาสตราจารย์ ดร. สุพัตรา รักการศิลป์', '100196@bru.ac.th', 'AUDITOR', '0', 'กรรมการ', NULL, '2026-11-05 05:51:36.111', '2026-11-05 05:51:36.111');
INSERT INTO public."User" VALUES ('d159f657-d4f7-465c-b5a4-2ae80b40d986', '500118', 'อาจารย์ ดร. พนาสินธุ์ ศรีวิเศษ', '500118@bru.ac.th', 'AUDITOR', '79', 'กรรมการ', NULL, '2026-11-05 05:51:36.112', '2026-11-05 05:51:36.112');
INSERT INTO public."User" VALUES ('cdda0f03-0680-467a-ad84-9c575e262a40', '400051', 'อาจารย์ อัญญา มธุรเมธา', '400051@bru.ac.th', 'AUDITOR', '123', 'กรรมการ', NULL, '2026-11-05 05:51:36.113', '2026-11-05 05:51:36.113');
INSERT INTO public."User" VALUES ('2da9c399-1066-4146-b491-2082b27bea12', '100223', 'ผู้ช่วยศาสตราจารย์ ดร. นิจพร ณ พัทลุง', '100223@bru.ac.th', 'AUDITOR', '158', 'กรรมการ', NULL, '2026-11-05 05:51:36.114', '2026-11-05 05:51:36.114');
INSERT INTO public."User" VALUES ('b75b849c-1e84-444e-93dd-53c655f62e52', '100061', 'อาจารย์ วิชชา ภัทรนิธิคุณากร', '100061@bru.ac.th', 'AUDITOR', '118', 'กรรมการ', NULL, '2026-11-05 05:51:36.115', '2026-11-05 05:51:36.115');
INSERT INTO public."User" VALUES ('e4723f82-4856-4af9-93c1-c46a276ea43d', '100232', 'อาจารย์ วิสาข์ แฝงเวียง', '100232@bru.ac.th', 'AUDITOR', '172', 'กรรมการ', NULL, '2026-11-05 05:51:36.116', '2026-11-05 05:51:36.116');
INSERT INTO public."User" VALUES ('fe84498d-865e-4629-97ec-072d3413c7b1', '100014', 'ผู้ช่วยศาสตราจารย์ วิไลวรรณ ศิริเมฆา', '100014@bru.ac.th', 'AUDITOR', '94', 'กรรมการ', NULL, '2026-11-05 05:51:36.116', '2026-11-05 05:51:36.116');
INSERT INTO public."User" VALUES ('2986dae9-7f89-49fa-94c4-8491040cf3f4', '440213', 'อาจารย์ ดร. ศรีเพ็ญ พลเดช', '440213@bru.ac.th', 'AUDITOR', '79', 'กรรมการ', NULL, '2026-11-05 05:51:36.117', '2026-11-05 05:51:36.117');
INSERT INTO public."User" VALUES ('56aa29fd-62f2-44a2-b206-3294c74f8c81', '57023', 'ผู้ช่วยศาสตราจารย์ ดร. เอกชัย ธีรภัคสิริ', '57023@bru.ac.th', 'AUDITOR', '79', 'กรรมการ', NULL, '2026-11-05 05:51:36.118', '2026-11-05 05:51:36.118');
INSERT INTO public."User" VALUES ('7250f36d-fd26-4ce1-b199-103349add924', '400015', 'ผู้ช่วยศาสตราจารย์ ดร. นพดล ธีระวงศ์ภิญโญ', '400015@bru.ac.th', 'AUDITOR', '123', 'กรรมการ', NULL, '2026-11-05 05:51:36.119', '2026-11-05 05:51:36.119');
INSERT INTO public."User" VALUES ('733dc76d-a787-4b91-84d1-51af71e6b772', '100113', 'อาจารย์ ดร. ทิพวัลย์ แสนคำ', '100113@bru.ac.th', 'AUDITOR', '118', 'กรรมการ', NULL, '2026-11-05 05:51:36.12', '2026-11-05 05:51:36.12');
INSERT INTO public."User" VALUES ('d24681df-e0eb-432b-9d4f-0773ed2bf281', '440228', 'ผู้ช่วยศาสตราจารย์ ดร. ผกามาศ บุตรสาลี', '440228@bru.ac.th', 'AUDITOR', '142', 'กรรมการ', NULL, '2026-11-05 05:51:36.12', '2026-11-05 05:51:36.12');
INSERT INTO public."User" VALUES ('6a6f7dd1-54bd-433a-a1f7-4a9fe6bf5c8d', '100180', 'ผู้ช่วยศาสตราจารย์ ดร. บรรเจิด สอนสุภาพ', '100180@bru.ac.th', 'AUDITOR', '158', 'กรรมการ', NULL, '2026-11-05 05:51:36.121', '2026-11-05 05:51:36.121');
INSERT INTO public."User" VALUES ('ad6824c8-7aa8-4e90-a797-c431e3065829', '100117', 'ผู้ช่วยศาสตราจารย์ วัชระ วชิรภัทรกุล', '100117@bru.ac.th', 'AUDITOR', '172', 'กรรมการ', NULL, '2026-11-05 05:51:36.122', '2026-11-05 05:51:36.122');
INSERT INTO public."User" VALUES ('ec1935f2-14f0-4c63-9bee-64c7dd80e8ab', '900131', 'อาจารย์ กนิษฐา จอดนอก', '900131@bru.ac.th', 'AUDITOR', '198', 'กรรมการ', NULL, '2026-11-05 05:51:36.122', '2026-11-05 05:51:36.122');
INSERT INTO public."User" VALUES ('90676e02-082c-4386-9726-b3bd8497b1a4', '100189', 'รองศาสตราจารย์ ดร. นฤมล สมคุณา', '100189@bru.ac.th', 'AUDITOR', '158', 'กรรมการ', NULL, '2026-11-05 05:51:36.124', '2026-11-05 05:51:36.124');
INSERT INTO public."User" VALUES ('5513702f-739b-4c08-a2b6-bee1cdc27cca', '100114', 'ผู้ช่วยศาสตราจารย์ ดร. ณัฐพล แสนคำ', '100114@bru.ac.th', 'AUDITOR', '118', 'กรรมการ', NULL, '2026-11-05 05:51:36.124', '2026-11-05 05:51:36.124');
INSERT INTO public."User" VALUES ('e918500c-48ab-4d0c-87b2-956f4e10495b', '400011', 'ผู้ช่วยศาสตราจารย์ ดร. อโศก ไทยจันทรารักษ์', '400011@bru.ac.th', 'AUDITOR', '79', 'กรรมการ', NULL, '2026-11-05 05:51:36.125', '2026-11-05 05:51:36.125');
INSERT INTO public."User" VALUES ('480c921a-9b64-4296-a952-e1bd2499d4a2', '100052', 'ผู้ช่วยศาสตราจารย์ ดร. ธิติ ปัญญาอินทร์', '100052@bru.ac.th', 'AUDITOR', '79', 'กรรมการ', NULL, '2026-11-05 05:51:36.126', '2026-11-05 05:51:36.126');
INSERT INTO public."User" VALUES ('f4fe08cd-23c2-4c2a-be82-7a5321e9fb20', '100109', 'อาจารย์ พวงเพชร ราชประโคน', '100109@bru.ac.th', 'AUDITOR', '1', 'กรรมการและเลขานุการ', NULL, '2026-11-05 05:51:36.127', '2026-11-05 05:51:36.127');
INSERT INTO public."User" VALUES ('69624fc5-7f7c-48c6-9467-54fdf82617e2', '300036', 'นาย ลัด พอกกลาง', '300036@bru.ac.th', 'AUDITOR', '40', 'กรรมการและเลขานุการ', NULL, '2026-11-05 05:51:36.127', '2026-11-05 05:51:36.127');
INSERT INTO public."User" VALUES ('fdc8e19d-7e4b-4d59-80c3-b9fa1e6ef802', '600034', 'นาย ประสิทธิ์ จันลา', '600034@bru.ac.th', 'AUDITOR', '40', 'กรรมการและผู้ช่วยเลขานุการ', NULL, '2026-11-05 05:51:36.129', '2026-11-05 05:51:36.129');
INSERT INTO public."User" VALUES ('ce74611d-d7c9-41c6-8350-34b89778b811', '600100', 'นาย อภิสิทธิ์ แพนแก้ว', '600100@bru.ac.th', 'AUDITOR', '40', 'กรรมการและผู้ช่วยเลขานุการ', NULL, '2026-11-05 05:51:36.13', '2026-11-05 05:51:36.13');
INSERT INTO public."User" VALUES ('d22c74e2-fcba-4a1a-a0ea-6d0422ac4d04', '5500010', 'ดุสิต เพชรเนื้อนิล', '5500010@bru.ac.th', 'AUDITOR', '40', 'กรรมการและผู้ช่วยเลขานุการ', NULL, '2026-11-05 05:51:36.131', '2026-11-05 05:51:36.131');
INSERT INTO public."User" VALUES ('95fd34e2-c0fc-45ee-98d6-1706ce78f381', '600099', 'อธิพงศ์ แต้มสี', '600099@bru.ac.th', 'AUDITOR', '40', 'กรรมการและผู้ช่วยเลขานุการ', NULL, '2026-11-05 05:51:36.132', '2026-11-05 05:51:36.132');


--
-- Name: Assessment Assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_pkey" PRIMARY KEY (id);


--
-- Name: BuildingStaff BuildingStaff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuildingStaff"
    ADD CONSTRAINT "BuildingStaff_pkey" PRIMARY KEY (id);


--
-- Name: Building Building_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Building"
    ADD CONSTRAINT "Building_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: EvaluationRound EvaluationRound_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EvaluationRound"
    ADD CONSTRAINT "EvaluationRound_pkey" PRIMARY KEY (id);


--
-- Name: FindingAttachment FindingAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FindingAttachment"
    ADD CONSTRAINT "FindingAttachment_pkey" PRIMARY KEY (id);


--
-- Name: QuestionItem QuestionItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionItem"
    ADD CONSTRAINT "QuestionItem_pkey" PRIMARY KEY (id);


--
-- Name: ScoreItem ScoreItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoreItem"
    ADD CONSTRAINT "ScoreItem_pkey" PRIMARY KEY (id);


--
-- Name: SystemSetting SystemSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSetting"
    ADD CONSTRAINT "SystemSetting_pkey" PRIMARY KEY (key);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Building_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Building_code_key" ON public."Building" USING btree (code);


--
-- Name: ScoreItem_assessmentId_questionItemId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ScoreItem_assessmentId_questionItemId_key" ON public."ScoreItem" USING btree ("assessmentId", "questionItemId");


--
-- Name: User_userlogin_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_userlogin_key" ON public."User" USING btree (userlogin);


--
-- Name: Assessment Assessment_assessorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assessment Assessment_buildingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES public."Building"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BuildingStaff BuildingStaff_buildingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuildingStaff"
    ADD CONSTRAINT "BuildingStaff_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES public."Building"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BuildingStaff BuildingStaff_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BuildingStaff"
    ADD CONSTRAINT "BuildingStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FindingAttachment FindingAttachment_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FindingAttachment"
    ADD CONSTRAINT "FindingAttachment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."Assessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuestionItem QuestionItem_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionItem"
    ADD CONSTRAINT "QuestionItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ScoreItem ScoreItem_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoreItem"
    ADD CONSTRAINT "ScoreItem_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."Assessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ScoreItem ScoreItem_questionItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScoreItem"
    ADD CONSTRAINT "ScoreItem_questionItemId_fkey" FOREIGN KEY ("questionItemId") REFERENCES public."QuestionItem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

-- \unrestrict T5gRQZaMmR9nDoUXonKVfM0xcR5wxdoiSjjkMYEwaS2eIlsJj1LpJgd5AAZdcqq

