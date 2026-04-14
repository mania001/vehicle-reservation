CREATE INDEX "idx_res_status_created" ON "reservations" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "idx_res_status_end" ON "reservations" USING btree ("status","end_at");--> statement-breakpoint
CREATE INDEX "idx_res_status_updated" ON "reservations" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "idx_usage_reservation_id" ON "usage_sessions" USING btree ("reservation_id");--> statement-breakpoint
CREATE INDEX "idx_usage_status_inspected" ON "usage_sessions" USING btree ("status","inspected_at");--> statement-breakpoint
CREATE INDEX "idx_usage_has_issue" ON "usage_sessions" USING btree ("has_issue","status");--> statement-breakpoint
CREATE INDEX "idx_usage_vehicle_id" ON "usage_sessions" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_usage_status" ON "usage_sessions" USING btree ("status");