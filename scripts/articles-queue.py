#!/usr/bin/env python3
"""Queue for writing finished blog articles from the research plans in the vault.

  python3 scripts/articles-queue.py status        # current batch: which plans are written
  python3 scripts/articles-queue.py next N        # claim the next N unwritten plans, print JSON with a brief per item
  python3 scripts/articles-queue.py remaining     # how many plans are still not `status: written`, per group

Order: Data first, then Business, then everything else by plan folder (owner's choice, 2026-11-13).
A plan is done when its frontmatter says `status: written` (the writer sets it after finishing the article).
"""
import json, os, re, sys, unicodedata

VAULT = os.environ.get('VAULT_DIR', '/Users/pc/Desktop/Sky/Sky_Vault')
PLANS = f'{VAULT}/Projects/Portfolio Website/Kế hoạch bài viết'
ARTICLES = f'{VAULT}/Projects/Portfolio Website/Bài viết'
STATE = os.path.expanduser('~/.claude/projects/-Users-pc-Desktop-Sky-Sky-Vault/articles-batch.json')
N = lambda s: unicodedata.normalize('NFC', s)

# priority groups, matched against the plan's `source:` (path under Resources/)
GROUPS = [
    ('data', [r'^Sinh học/Bioinformatics/B - Data Science and Bioinformatics/I - Data Science/',
              r'^Sinh học/Bioinformatics/A - Statistics and Biostatistics/',
              r'^Sinh học/Biology Project and Lab Report/Introduction to Data Analysis',
              r'^Sinh học/Biology Project and Lab Report/Biostatistics and Bioinformatics',
              r'^Sinh học/Bioinformatics/C - Computational Programming',
              r'^Sinh học/Bioinformatics/B - Data Science and Bioinformatics/',
              r'^AI và DEV/Khoá học AI của Tsing Hua University/Learning Module/(01 - Data Mining|05 - Statistic|10 - Causal)']),
    ('business', [r'^Business/']),
    # the rest, by season: high-school biology before the THPT exam (June), then French (DELF sessions),
    # then university lab work, ANR, general courses and AI/education (owner: "còn lại", order set 2026-11-13)
    ('biology-thpt', [r'^Sinh học/Kiến thức chung/']),
    ('french', [r'^Tiếng Pháp/']),
    ('biology-lab', [r'^Sinh học/Biology Project and Lab Report/', r'^Sinh học/ISO']),
    ('anr', [r'^Sinh học/Assisted Natural Regeneration']),
    ('other', [r'.']),
]


def fm(path):
    t = open(path, encoding='utf8').read()
    m = re.match(r'---\n(.*?)\n---\n', t, re.S)
    d = {}
    for line in (m.group(1).split('\n') if m else []):
        k = re.match(r'^([a-z_]+):\s*(.*)$', line)
        if k:
            d[k.group(1)] = k.group(2).strip().strip('"')
    return d


def plans():
    out = []
    for root, _, files in os.walk(PLANS):
        for f in files:
            if f.startswith('KH - ') and f.endswith('.md'):
                p = os.path.join(root, f)
                d = fm(p)
                src = N(d.get('source', ''))
                for gi, (g, pats) in enumerate(GROUPS):
                    hit = next((pi for pi, pat in enumerate(pats) if re.search(N(pat), src)), None)
                    if hit is not None:
                        break
                out.append({'plan': N(p), 'source': src, 'status': d.get('status'), 'type': d.get('article_type', ''),
                            'words': int(d.get('word_target') or 4500), 'group': g, 'key': (gi, hit, N(p))})
    return sorted(out, key=lambda x: x['key'])


def article_path(it):
    topic = os.path.relpath(os.path.dirname(it['plan']), PLANS)
    name = os.path.basename(it['plan'])[len('KH - '):]
    return N(os.path.join(ARTICLES, topic, 'BV - ' + name))


BRIEF = """Write one complete blog article in the Obsidian vault /Users/pc/Desktop/Sky/Sky_Vault from an existing research plan. The owner approved three pilot articles; match their standard.

Read fully first:
- Style guide (binding, every rule): {guide}
- A finished example of the house style: {example}
- Plan: {plan}
- Original note (do NOT modify): /Users/pc/Desktop/Sky/Sky_Vault/Resources/{source}

Output: {out}
A {type} article in Vietnamese, about {words} words (±15%; count the body without the reference list and code blocks), following the plan's outline. Create the folder if needed.

Owner's rules that matter most (all in the style guide):
- The article is about the TOPIC, written from the topic's sources. Never mention the owner's notebook, notes, Memo pages, photos, course materials as something being checked or corrected, or the owner's own mistakes/scores/tests. Where the plan says the note or course has an error, just write the correct content; never say what was wrong or where. If the plan's hook relies on such an error, write a hook about the topic instead.
- Minimise first person; address the reader as "bạn". Title Vietnamese only, ≤ ~90 characters.
- Use the plan's verified claims. Do not spend effort re-verifying claims the plan already marks verified. A claim marked "cần kiểm chứng" may be used only after you verify it (PubMed MCP via ToolSearch, Crossref api.crossref.org/works/<doi> via WebFetch, the original page); otherwise drop or clearly hedge it. Never invent sources, numbers or quotes.
- APA 7 author–year citations and `## Tài liệu tham khảo` with DOIs/URLs; no drive.google.com / docs.google.com links.
- Code and formulas must run: test them on a small inline dataset before including them (python3 with pandas, sqlite3). Charts only from real or clearly simulated data, matplotlib PNG saved to {assets} named bv-{slug}-<n>.png, embedded with ![[file.png]]. Mermaid diagrams `flowchart TB`, at most 3 boxes wide.
- Inline [[wikilinks]] to related vault notes where genuinely relevant; never to the original note in the body.
- Frontmatter exactly as section 2 of the style guide (type: article, replaces = source, plan link, status: draft, word_count).
- After writing: in the plan set `status: written` and append ` · Bài viết: [[{out_name}|Bài viết]]` to its **Links** line; add owner-only tasks to the plan's `## Việc cần làm`. Touch no other files (keep any scratch files in your own new temp folder and delete only what you created). Do not git commit.

Before finishing, grep the body (excluding the **Links** line) for: sổ, Memo, IMG_, khoá học, khóa học, Coursera, của tôi, chính tôi, ghi chú gốc, note gốc, mình — and fix any reference to the owner's notes, course errors or personal mistakes.

Return (concise): output path, word count, claims dropped/hedged, figures created, owner tasks added."""


def brief(it):
    out = article_path(it)
    slug = re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFD', os.path.basename(out)[5:-3]).encode('ascii', 'ignore').decode().lower()).strip('-')[:40]
    return BRIEF.format(guide=f'{ARTICLES}/00 - Quy chuẩn viết bài.md',
                        example=f'{ARTICLES}/Sinh học/BV - 04 - Process data from Dirty to Clean.md',
                        plan=it['plan'], source=it['source'], out=out, type=it['type'] or 'review', words=it['words'],
                        assets=f'{ARTICLES}/assets/', slug=slug, out_name=os.path.basename(out)[:-3])


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    ps = plans()
    if cmd == 'remaining':
        from collections import Counter
        c = Counter(p['group'] for p in ps if p['status'] != 'written')
        print(json.dumps({'remaining': sum(c.values()), 'by_group': c}, ensure_ascii=False))
    elif cmd == 'status':
        batch = json.load(open(STATE)) if os.path.exists(STATE) else []
        st = {p['plan']: p['status'] for p in ps}
        res = [{'plan': os.path.basename(b), 'written': st.get(N(b)) == 'written',
                'article_exists': os.path.exists(article_path({'plan': N(b)}))} for b in batch]
        print(json.dumps({'batch': res, 'all_written': all(r['written'] for r in res)}, ensure_ascii=False, indent=1))
    elif cmd == 'next':
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 3
        todo = [p for p in ps if p['status'] != 'written'][:n]
        json.dump([t['plan'] for t in todo], open(STATE, 'w'), ensure_ascii=False)
        print(json.dumps([{'plan': os.path.basename(t['plan']), 'group': t['group'], 'out': article_path(t),
                           'brief': brief(t)} for t in todo], ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
