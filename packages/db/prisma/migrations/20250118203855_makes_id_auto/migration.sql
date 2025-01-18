-- AlterTable
CREATE SEQUENCE circle_id_seq;
ALTER TABLE "Circle" ALTER COLUMN "id" SET DEFAULT nextval('circle_id_seq'),
ADD CONSTRAINT "Circle_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE circle_id_seq OWNED BY "Circle"."id";

-- AlterTable
CREATE SEQUENCE free_id_seq;
ALTER TABLE "Free" ALTER COLUMN "id" SET DEFAULT nextval('free_id_seq'),
ADD CONSTRAINT "Free_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE free_id_seq OWNED BY "Free"."id";

-- AlterTable
CREATE SEQUENCE line_id_seq;
ALTER TABLE "Line" ALTER COLUMN "id" SET DEFAULT nextval('line_id_seq'),
ADD CONSTRAINT "Line_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE line_id_seq OWNED BY "Line"."id";

-- AlterTable
CREATE SEQUENCE text_id_seq;
ALTER TABLE "Text" ALTER COLUMN "id" SET DEFAULT nextval('text_id_seq'),
ADD CONSTRAINT "Text_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE text_id_seq OWNED BY "Text"."id";
