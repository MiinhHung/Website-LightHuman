import { Text, View } from "@react-pdf/renderer";
import type { Cell, TableColumn, TableModel } from "../../build-quote-document";
import { CONTENT_WIDTH, EMPTY_CELL, PDF_COLORS, PDF_FONT, PDF_TABLE, type PdfStyle as Style } from "../theme";

const edge: Style = {
  borderRightWidth: PDF_TABLE.border,
  borderBottomWidth: PDF_TABLE.border,
  borderColor: PDF_COLORS.border,
  borderStyle: "solid",
};

const cellBox: Style = {
  ...edge,
  justifyContent: "center",
  paddingVertical: PDF_TABLE.padV,
  paddingHorizontal: PDF_TABLE.padH,
};

function lineHeightPt(lines: number): number {
  return lines * PDF_FONT.base * PDF_FONT.lineHeight + PDF_TABLE.padV * 2 + 2;
}

function CellBox({ width, cell, style }: { width: number; cell: Cell | undefined; style?: Style }) {
  const lines = cell?.lines.length ? cell.lines : [EMPTY_CELL];
  const toneStyle: Style =
    cell?.tone === "condition" ? { color: PDF_COLORS.condition, fontStyle: "italic" } : {};
  return (
    <View style={[cellBox, { width }, style ?? {}]}>
      {lines.map((line, i) => (
        <Text key={i} style={[{ textAlign: "center" }, toneStyle]}>
          {line}
        </Text>
      ))}
    </View>
  );
}

function HeaderCell({ width, text, grow }: { width?: number; text: string; grow?: boolean }) {
  return (
    <View
      style={[
        cellBox,
        { backgroundColor: PDF_COLORS.headerFill, alignItems: "stretch" },
        width !== undefined ? { width } : {},
        grow ? { flexGrow: 1 } : {},
      ]}
    >
      <Text style={{ textAlign: "center", fontWeight: 700 }}>{text}</Text>
    </View>
  );
}

type Segment<K> = { readonly key: K; readonly cols: TableColumn[] };

/** Splits columns into contiguous runs sharing the same key. */
function segment<K>(cols: readonly TableColumn[], keyOf: (c: TableColumn) => K): Segment<K>[] {
  const out: Segment<K>[] = [];
  for (const col of cols) {
    const key = keyOf(col);
    const last = out.at(-1);
    if (last && last.key === key && key !== null) last.cols.push(col);
    else out.push({ key, cols: [col] });
  }
  return out;
}

/**
 * Renders a TableModel with nested flex boxes:
 * "group" cells span a position's sub-rows, "row" cells are stacked per
 * sub-row, "table" cells span the whole body. Every box draws only its right
 * and bottom border; the outer frame draws left and top.
 */
export function PdfTable({ table }: { table: TableModel }) {
  const width = (CONTENT_WIDTH * table.widthPct) / 100;
  const totalWeight = table.columns.reduce((s, c) => s + c.weight, 0);
  const w = (c: TableColumn) => (width * c.weight) / totalWeight;
  const sumW = (cols: readonly TableColumn[]) => cols.reduce((s, c) => s + w(c), 0);
  const minRowHeight = lineHeightPt(table.minRowLines);

  const bodyCols = table.columns.filter((c) => c.span !== "table");
  const tableCols = table.columns.filter((c) => c.span === "table");
  const bodySegments = segment(bodyCols, (c) => c.span);
  const headerSegments = segment(table.columns, (c) => c.group);

  return (
    <View
      style={{
        width,
        borderLeftWidth: PDF_TABLE.border,
        borderColor: PDF_COLORS.border,
        borderStyle: "solid",
      }}
    >
      {/* `fixed` repeats banner + column headers on every page the table spans;
          the top border lives on the banner so each page's slice is closed. */}
      <View fixed wrap={false} minPresenceAhead={minRowHeight}>
        <View
          style={[edge, { borderTopWidth: PDF_TABLE.border, backgroundColor: PDF_COLORS.navy, paddingVertical: 2 }]}
        >
          <Text style={{ color: PDF_COLORS.onNavy, fontWeight: 700, textAlign: "center" }}>{table.banner}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {headerSegments.map((seg, i) =>
            seg.key === null ? (
              <HeaderCell key={i} width={w(seg.cols[0])} text={seg.cols[0].header} />
            ) : (
              <View key={i} style={{ width: sumW(seg.cols) }}>
                <HeaderCell text={seg.key} />
                <View style={{ flexDirection: "row", flexGrow: 1 }}>
                  {seg.cols.map((c) => (
                    <HeaderCell key={c.key} width={w(c)} text={c.header} />
                  ))}
                </View>
              </View>
            ),
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: sumW(bodyCols) }}>
          {table.groups.map((group, gi) => (
            // flexGrow lets the groups absorb a taller "table" cell instead of leaving a gap.
            <View key={gi} wrap={false} style={{ flexDirection: "row", flexGrow: 1 }}>
              {bodySegments.map((seg, si) =>
                seg.key === "group" ? (
                  seg.cols.map((c) => <CellBox key={c.key} width={w(c)} cell={group.cells[c.key]} />)
                ) : (
                  <View key={si} style={{ width: sumW(seg.cols) }}>
                    {group.rows.map((row, ri) => (
                      <View key={ri} style={{ flexDirection: "row", flexGrow: 1, minHeight: minRowHeight }}>
                        {seg.cols.map((c) => (
                          <CellBox key={c.key} width={w(c)} cell={row[c.key]} />
                        ))}
                      </View>
                    ))}
                  </View>
                ),
              )}
            </View>
          ))}
        </View>
        {tableCols.map((c) => (
          <CellBox key={c.key} width={w(c)} cell={table.tableCells[c.key]} />
        ))}
      </View>
    </View>
  );
}

export function tableWidth(table: TableModel): number {
  return (CONTENT_WIDTH * table.widthPct) / 100;
}
