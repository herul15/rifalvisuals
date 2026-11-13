import type { Prisma } from "@prisma/client";
export function writeAudit(tx: Prisma.TransactionClient, adminId: string, action: string, entityType: string, entityId: string, oldValue: unknown, newValue: unknown, packageId?: string) {
  return tx.auditLog.create({ data: { adminId, action, entityType, entityId, packageId,
    oldValue: oldValue == null ? null : JSON.stringify(oldValue), newValue: newValue == null ? null : JSON.stringify(newValue) } });
}
