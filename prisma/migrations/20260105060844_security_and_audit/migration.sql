-- Enable RLS on Property Table
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;

-- Helper function to get current app user (set by application middleware)
CREATE OR REPLACE FUNCTION current_app_user() RETURNS text AS $$
BEGIN
    RETURN current_setting('app.current_user_id', true);
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies

-- SELECT: Public can see ACTIVE, Owner can see ALL theirs
CREATE POLICY "property_select_policy" ON "Property"
  FOR SELECT
  USING (
    "status" = 'ACTIVE' 
    OR 
    "ownerId" = current_app_user()
  );

-- INSERT: Authenticated users only (and must own the record)
CREATE POLICY "property_insert_policy" ON "Property"
  FOR INSERT
  WITH CHECK (
    "ownerId" = current_app_user()
  );

-- UPDATE: Owner only
CREATE POLICY "property_update_policy" ON "Property"
  FOR UPDATE
  USING (
    "ownerId" = current_app_user()
  )
  WITH CHECK (
    "ownerId" = current_app_user()
  );

-- DELETE: Owner only
CREATE POLICY "property_delete_policy" ON "Property"
  FOR DELETE
  USING (
    "ownerId" = current_app_user()
  );

-- Audit Log Trigger

CREATE OR REPLACE FUNCTION process_audit_log() RETURNS TRIGGER AS $$
DECLARE
    app_user text;
BEGIN
    app_user := current_setting('app.current_user_id', true);
    
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO "AuditLog" ("id", "entityName", "entityId", "action", "changedBy", "changes", "createdAt")
        VALUES (
            gen_random_uuid()::text, 
            TG_TABLE_NAME, 
            OLD."id", 
            'DELETE', 
            app_user, 
            row_to_json(OLD), 
            now()
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO "AuditLog" ("id", "entityName", "entityId", "action", "changedBy", "changes", "createdAt")
        VALUES (
            gen_random_uuid()::text, 
            TG_TABLE_NAME, 
            NEW."id", 
            'UPDATE', 
            app_user, 
            json_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)), 
            now()
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO "AuditLog" ("id", "entityName", "entityId", "action", "changedBy", "changes", "createdAt")
        VALUES (
            gen_random_uuid()::text, 
            TG_TABLE_NAME, 
            NEW."id", 
            'INSERT', 
            app_user, 
            row_to_json(NEW), 
            now()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger on Property
DROP TRIGGER IF EXISTS audit_property_changes ON "Property";
CREATE TRIGGER audit_property_changes
AFTER INSERT OR UPDATE OR DELETE ON "Property"
FOR EACH ROW EXECUTE FUNCTION process_audit_log();