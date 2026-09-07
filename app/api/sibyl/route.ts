import { NextRequest, NextResponse } from "next/server";
import { SibylEntityMemory, SibylJournalEvent } from "@/lib/types";

// In-memory / Server-side store replicating Sibyl SQLite FTS5 table
let serverEntities: SibylEntityMemory[] = [];

let serverJournal: SibylJournalEvent[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const action = searchParams.get("action");

  // MCP Manifest Export
  if (action === "mcp_manifest") {
    return NextResponse.json({
      name: "sibyl-memory-mcp",
      version: "1.0.0",
      description: "Official Sibyl Memory MCP Tool Schema for InheritanceFi",
      tools: [
        {
          name: "set_entity",
          description: "Persist an entity into Sibyl memory WARM tier with unique constraint (tenant_id, category, name)",
          parameters: {
            type: "object",
            properties: {
              category: { type: "string", enum: ["beneficiary", "preference", "directive", "rule"] },
              name: { type: "string" },
              body: { type: "object" },
            },
            required: ["category", "name", "body"],
          },
        },
        {
          name: "search_entities",
          description: "Full-text FTS5 search across all Sibyl memory entities",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string" },
            },
            required: ["query"],
          },
        },
        {
          name: "delete_entity",
          description: "Permanently delete an entity from Sibyl memory",
          parameters: {
            type: "object",
            properties: {
              category: { type: "string" },
              name: { type: "string" },
            },
            required: ["category", "name"],
          },
        },
      ],
    });
  }

  if (query && query.trim() !== "") {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const results = serverEntities.filter((entity) => {
      const fullText = `${entity.category} ${entity.name} ${JSON.stringify(entity.body)}`.toLowerCase();
      return terms.some((term) => fullText.includes(term));
    });
    return NextResponse.json({ success: true, count: results.length, data: results });
  }

  return NextResponse.json({
    success: true,
    count: serverEntities.length,
    entities: serverEntities,
    journal: serverJournal.slice(0, 20),
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action, category, name, body, id } = data;

    if (action === "set_entity") {
      const existingIndex = serverEntities.findIndex(
        (e) => e.category.toLowerCase() === category.toLowerCase() && e.name.toLowerCase() === name.toLowerCase()
      );

      const now = new Date().toISOString();
      let entity: SibylEntityMemory;

      if (existingIndex >= 0) {
        entity = {
          ...serverEntities[existingIndex],
          body: { ...serverEntities[existingIndex].body, ...body },
          updatedAt: now,
        };
        serverEntities[existingIndex] = entity;
      } else {
        entity = {
          id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          tenantId: "tenant_user_legacy_01",
          category,
          name,
          body,
          createdAt: now,
          updatedAt: now,
        };
        serverEntities.push(entity);
      }

      serverJournal.unshift({
        id: `ev-${Date.now()}`,
        tenantId: "tenant_user_legacy_01",
        timestamp: now,
        action: `Set entity [${category}:${name}]`,
        context: JSON.stringify(body),
        actor: "agent",
      });

      return NextResponse.json({ success: true, entity });
    }

    if (action === "clear_demo") {
      serverEntities = serverEntities.filter((e) => e.name.toLowerCase() !== "brother" || e.category !== "preference");
      return NextResponse.json({ success: true, message: "Cleared demo memory" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  if (id) {
    serverEntities = serverEntities.filter((e) => e.id !== id);
    return NextResponse.json({ success: true, message: `Deleted entity ${id}` });
  }

  if (name) {
    serverEntities = serverEntities.filter((e) => e.name.toLowerCase() !== name.toLowerCase());
    return NextResponse.json({ success: true, message: `Deleted entity ${name}` });
  }

  return NextResponse.json({ error: "Missing id or name" }, { status: 400 });
}
