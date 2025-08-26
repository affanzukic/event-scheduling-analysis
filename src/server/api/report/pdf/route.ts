import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { generatePdfStream } from '@/lib/report/pdfGenerator';
import { renderBar, renderLine } from '@/lib/visualize';
import { ResultJson } from '@/types/api/upload';
import { nodeToWeb } from '@/utils/url';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  const rec = await prisma.analysis.findUnique({ where: { id } });
  if (!rec) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const result = rec.resultJson as ResultJson;
  const all = result.all || [];

  // candidate chart
  const dateMap = new Map<string, number>();
  for (const a of all) {
    const prev = dateMap.get(a.date) ?? 0;
    if (a.score > prev) dateMap.set(a.date, a.score);
  }
  const datePairs = Array.from(dateMap.entries()).sort((a,b)=>b[1]-a[1]).slice(0,200);
  const labels = datePairs.map(d=>d[0]);
  const data = datePairs.map(d=>d[1]);
  const candidateBuf = await renderLine(labels, data);

  // venue freq
  const vMap = new Map<string, number>();
  for (const a of all) vMap.set(a.venue, (vMap.get(a.venue) || 0) + 1);
  const vEntries = Array.from(vMap.entries()).sort((a,b)=>b[1]-a[1]);
  const vLabels = vEntries.map(e=>e[0]).slice(0,50);
  const vData = vEntries.map(e=>e[1]).slice(0,50);
  const venueBuf = await renderBar(vLabels, vData);

  const charts = { 'Candidate scores': candidateBuf, 'Venue frequency': venueBuf };

  const pdfStream = await generatePdfStream({ result, charts });
  const headers = new Headers();
  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Disposition', `attachment; filename="report-${id}.pdf"`);

  return new NextResponse(nodeToWeb(pdfStream), { headers });
}

