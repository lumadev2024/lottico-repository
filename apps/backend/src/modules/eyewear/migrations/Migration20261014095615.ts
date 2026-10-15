import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261014095615 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "eyewear_details" ("id" text not null, "brand" text not null, "model_name" text null, "gender" text check ("gender" in ('uomo', 'donna', 'unisex', 'bambino')) null, "frame_shape" text null, "frame_material" text null, "frame_color" text null, "lens_color" text null, "lens_type" text check ("lens_type" in ('vista', 'sole', 'neutra', 'fotocromatica', 'polarizzata', 'altro')) null, "polarized" boolean not null default false, "lens_width" integer null, "bridge_width" integer null, "temple_length" integer null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "eyewear_details_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_eyewear_details_deleted_at" ON "eyewear_details" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "eyewear_details" cascade;`);
  }

}
