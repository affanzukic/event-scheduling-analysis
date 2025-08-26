import { Document, Image, Page, renderToStream, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Readable } from 'stream';

import { ScoringResult } from '@/types/event';
import { toDataUrl } from '@/utils/url';

type Props = {
  result: ScoringResult;
  charts: { [k: string]: Buffer };
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: 'Helvetica' },
  title: { fontSize: 18, marginBottom: 8 },
  section: { marginBottom: 12 },
  image: { width: '100%', height: 240, marginBottom: 12 }
});

export const generatePdfStream = async ({ result, charts }: Props) => {
  const doc = (
    <Document>
      <Page style={styles.page} size="A4">
        <View style={styles.section}>
          <Text style={styles.title}>Event Scheduling Analysis</Text>
          <Text>Generated: {result.meta?.timestamp}</Text>
          <Text>Year: {result.year}</Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontSize: 14 }}>Top 5</Text>
          <Text>{(result.top5 || []).map((t, i: number) => `${i + 1}. ${t.date} @ ${t.venue} — ${t.score.toFixed(2)}`).join('\n')}</Text>
        </View>
        {Object.entries(charts).map(([name, buf]) => (
          <View key={name} style={styles.section}>
            <Text style={{ marginBottom: 6 }}>{name}</Text>
            {/* eslint-disable-next-line */}
            <Image src={toDataUrl(buf)} style={styles.image} />
          </View>
        ))}
      </Page>
    </Document>
  );
  return await renderToStream(doc) as Readable;
};
