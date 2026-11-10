---
title: 'Phần 7 – Transcriptomics: RNA-seq và single-cell'
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-07
  - transcriptomics
  - rna-seq
  - single-cell
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/07 - Transcriptomics - RNA-seq và single-cell.md
status: chưa học
order: 7
description: >-
  RNA-seq là loại phân tích được yêu cầu nhiều nhất trong nghiên cứu và tuyển
  dụng. Kết quả cuối cùng thường là danh sách gen biểu hiện khác biệt và các
  pathway liên quan.
isIndex: false
---
RNA-seq là loại phân tích được yêu cầu nhiều nhất trong nghiên cứu và tuyển dụng. Kết quả cuối cùng thường là danh sách gen biểu hiện khác biệt và các pathway liên quan.

**Mục tiêu:** chạy RNA-seq bulk từ FASTQ đến gen biểu hiện khác biệt, vẽ các biểu đồ chuẩn (PCA, volcano, heatmap), phân tích làm giàu chức năng, và làm quen single-cell.

## 7.1 Thiết kế thí nghiệm

- Tối thiểu 3 mẫu lặp sinh học mỗi nhóm; 5–6 mẫu cho kết quả ổn định hơn.
- Phân bố mẫu đều giữa các lô xử lý để tách được hiệu ứng lô.
- Chọn thư viện: poly-A (mRNA) hay ribo-depletion (cả RNA không mã hóa); stranded hay không.

## 7.2 Định lượng biểu hiện

Hai cách tiếp cận:

- **Căn chỉnh rồi đếm:** STAR hoặc HISAT2 → featureCounts. Có BAM để kiểm tra trực quan.
- **Giả căn chỉnh (pseudo-alignment):** Salmon hoặc kallisto → tximport. Nhanh hơn nhiều, định lượng ở mức transcript.

```bash
salmon index -t transcripts.fa -i salmon_idx
salmon quant -i salmon_idx -l A -1 R1.fq.gz -2 R2.fq.gz -p 8 -o quant/sample1
```

## 7.3 Biểu hiện khác biệt với DESeq2

```r
library(DESeq2)
dds <- DESeqDataSetFromMatrix(countData = counts, colData = meta, design = ~ batch + condition)
dds <- dds[rowSums(counts(dds) >= 10) >= 3, ]   # lọc gen biểu hiện thấp
dds <- DESeq(dds)
res <- results(dds, contrast = c("condition", "tumor", "normal"))
res <- lfcShrink(dds, coef = "condition_tumor_vs_normal", type = "apeglm")
sig <- subset(res, padj < 0.05 & abs(log2FoldChange) > 1)
plotPCA(vst(dds), intgroup = "condition")
```

Biểu đồ chuẩn cần vẽ (→ [Share Data through Visualization](/blog/sinh-hoc/bioinformatics/b-data-science-and-bioinformatics/i-data-science/06-share-data-through-the-art-of-visualization/)):

- **PCA:** mẫu có tách theo điều kiện không, có mẫu ngoại lai hay lô không.
- **Volcano plot:** trục x là log2 FC, trục y là −log10(padj); gen ở hai góc trên là gen quan trọng.
- **MA plot, heatmap** của 50 gen khác biệt nhất (gói pheatmap hoặc ComplexHeatmap).

## 7.4 Phân tích làm giàu chức năng

- **ORA (over-representation):** danh sách gen có ý nghĩa có làm giàu nhóm GO/KEGG nào không (kiểm định siêu bội). (→ [Exosome ung thư gan (tiểu luận)](/blog/sinh-hoc/biology-project-and-lab-report/proteomics-and-structural-biology/08-he-protein-exosome-ung-thu-gan-tieu-luan/))
- **GSEA:** xếp hạng toàn bộ gen theo thống kê, không cần ngưỡng; dùng bộ gen MSigDB (Hallmark).
- Công cụ: clusterProfiler, fgsea (R); g:Profiler, Enrichr (web).

## 7.5 Single-cell RNA-seq

Quy trình chuẩn với Scanpy (Python) hoặc Seurat (R):

1. Định lượng: Cell Ranger, STARsolo hoặc alevin-fry.
2. QC tế bào: loại tế bào có ít gen, tỷ lệ RNA ty thể cao, doublet (scDblFinder, Scrublet).
3. Chuẩn hóa, chọn gen biến thiên cao, PCA.
4. Tích hợp nhiều mẫu nếu cần (Harmony, scVI).
5. Đồ thị lân cận → phân cụm Leiden → UMAP.
6. Gán loại tế bào bằng gen đánh dấu hoặc CellTypist.
7. Phân tích hạ nguồn: biểu hiện khác biệt (pseudobulk), quỹ đạo (trajectory), giao tiếp tế bào (CellChat).

```python
import scanpy as sc
adata = sc.datasets.pbmc3k()
sc.pp.filter_cells(adata, min_genes=200)
sc.pp.normalize_total(adata, target_sum=1e4); sc.pp.log1p(adata)
sc.pp.highly_variable_genes(adata, n_top_genes=2000)
sc.pp.pca(adata); sc.pp.neighbors(adata)
sc.tl.leiden(adata); sc.tl.umap(adata)
sc.pl.umap(adata, color="leiden")
```

**Bài tập (dự án portfolio 1)**

- [ ] Chọn một bộ RNA-seq ung thư trên GEO (khối u vs mô lành), chạy Salmon → DESeq2 → GSEA, vẽ PCA, volcano, heatmap.
- [ ] Chạy hướng dẫn PBMC 3k của Scanpy, gán tên ít nhất 6 loại tế bào miễn dịch.

**Tài nguyên:** hướng dẫn RNA-seq của [Bioconductor](https://bioconductor.org/help/workflows/), [Scanpy tutorials](https://scanpy.readthedocs.io), sách "Orchestrating Single-Cell Analysis with Bioconductor", [Single-cell best practices](https://www.sc-best-practices.org).

## Ghi chép khi học

-
