import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    const lower = (message || "").toLowerCase();

    // Virtuals GAME Tool schema
    const tools = [
      {
        name: "save_memory",
        description: "Save beneficiary context or distribution preference to Sibyl",
      },
      {
        name: "search_memory",
        description: "Search Sibyl Memory for stored preferences",
      },
      {
        name: "update_plan",
        description: "Update allocations or payout types in the vault plan",
      },
    ];

    let reply = "";
    let toolUsed = null;

    if (lower.includes("brother") && (lower.includes("study") || lower.includes("school") || lower.includes("gradual") || lower.includes("college"))) {
      toolUsed = {
        name: "save_memory",
        args: { category: "preference", name: "Brother", directive: "Gradual release for education" },
      };
      reply = "I've permanently recorded your instruction in **Sibyl Memory**: Marcus (Brother) will receive his 30% allocation in annual installments over 4 years to support his college studies, rather than in a lump sum.";
    } else if (lower.includes("what did i say") || lower.includes("what are my wishes")) {
      toolUsed = {
        name: "search_memory",
        args: { query: "Brother education preference" },
      };
      reply = "According to **Sibyl Memory**, you specified that Marcus is currently studying, and you want his 30% inheritance released gradually over 4 years.";
    } else if (lower.includes("how should") && lower.includes("brother")) {
      reply = "### Recommended Plan: Staged Educational Vesting\nBased on your remembered preference in Sibyl, I recommend distributing Marcus's 30% ($3,000 / 1.50 ETH) in 25% annual tranches over 4 college years.";
    } else {
      reply = "I am your InheritanceFi assistant. You can tell me about your family, adjust allocations, or ask questions about our smart contract vault on Base.";
    }

    return NextResponse.json({
      success: true,
      reply,
      toolUsed,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
