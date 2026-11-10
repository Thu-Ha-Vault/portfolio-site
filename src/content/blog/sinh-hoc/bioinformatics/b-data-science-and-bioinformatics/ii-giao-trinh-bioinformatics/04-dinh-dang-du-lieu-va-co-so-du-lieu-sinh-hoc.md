---
title: Phần 4 – Định dạng dữ liệu và cơ sở dữ liệu sinh học
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-04
  - file-formats
  - biological-databases
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/04 - Định dạng dữ liệu và cơ sở dữ liệu sinh học.md
status: chưa học
order: 4
description: >-
  Mỗi bước trong pipeline đọc một định dạng và ghi ra định dạng khác. Hiểu định
  dạng giúp bạn đọc lỗi, kiểm tra kết quả và nối các công cụ với nhau.
isIndex: false
---
Mỗi bước trong pipeline đọc một định dạng và ghi ra định dạng khác. Hiểu định dạng giúp bạn đọc lỗi, kiểm tra kết quả và nối các công cụ với nhau.

**Mục tiêu:** đọc được bằng mắt các định dạng chính, biết công cụ xử lý từng loại, và tải dữ liệu từ các cơ sở dữ liệu lớn.

## 4.1 Các định dạng file

| Định dạng           | Chứa gì                                | Công cụ xử lý                     |
| ------------------- | -------------------------------------- | --------------------------------- |
| FASTA (.fa, .fasta) | Trình tự, mỗi bản ghi bắt đầu bằng `>` | seqkit, samtools faidx, Biopython |
| FASTQ (.fastq.gz)   | Read + điểm chất lượng, 4 dòng/read    | FastQC, fastp, seqkit             |
| SAM / BAM / CRAM    | Vị trí read đã căn chỉnh lên genome    | samtools, pysam, IGV              |
| VCF / BCF           | Biến thể (SNP, indel) và kiểu gen      | bcftools, GATK, VEP               |
| BED                 | Vùng genome: nhiễm sắc thể, đầu, cuối  | bedtools                          |
| GFF3 / GTF          | Chú giải gen: exon, CDS, transcript    | gffread, featureCounts            |
| bigWig              | Độ phủ tín hiệu dọc genome             | deepTools, IGV                    |
| PDB / mmCIF         | Tọa độ 3D nguyên tử của protein        | PyMOL, ChimeraX, Biopython        |

**Đọc một bản ghi FASTQ:**

```
@SRR001 read_1
GATTTGGGGTTCAAAGCAGT
+
IIIIIIIIIIIIIIIIII9I
```

Dòng 1 là tên read, dòng 2 là trình tự, dòng 3 là dấu `+`, dòng 4 là điểm chất lượng Phred mã hóa ASCII. Điểm Phred Q liên hệ với xác suất sai P theo công thức dưới; Q30 nghĩa là 1 lỗi trên 1.000 base.

$$
Q = -10 \log_{10} P
$$

**Lưu ý tọa độ:** BED bắt đầu đếm từ 0 (nửa mở), còn GFF, VCF, SAM đếm từ 1. Đây là nguồn lỗi "lệch 1" phổ biến.

## 4.2 Cơ sở dữ liệu chính

| Nhóm        | Cơ sở dữ liệu                         | Dùng để                                           |
| ----------- | ------------------------------------- | ------------------------------------------------- |
| Trình tự    | NCBI GenBank/RefSeq, ENA              | Tra trình tự gen, mRNA, genome                    |
| Dữ liệu thô | SRA, ENA, GEO, ArrayExpress           | Tải FASTQ và ma trận biểu hiện từ bài báo         |
| Genome      | Ensembl, UCSC Genome Browser          | Genome tham chiếu, chú giải, trình duyệt          |
| Protein     | UniProt, PDB, AlphaFold DB            | Chức năng, trình tự, cấu trúc protein             |
| Biến thể    | dbSNP, ClinVar, gnomAD, COSMIC        | Tần số allele, ý nghĩa lâm sàng, đột biến ung thư |
| Chức năng   | Gene Ontology, KEGG, Reactome, STRING | Chú giải chức năng, pathway, tương tác protein    |
| Ung thư     | TCGA (qua GDC), cBioPortal            | Dữ liệu đa omics của hơn 30 loại ung thư          |
| Tài liệu    | PubMed, PMC                           | Tra cứu bài báo                                   |

## 4.3 Thực hành: tải dữ liệu

```bash
# Tải read từ SRA (cài bằng: conda install -c bioconda sra-tools)
fasterq-dump SRR390728 --split-files -O data/

# Tải genome tham chiếu người GRCh38 từ Ensembl
wget https://ftp.ensembl.org/pub/current_fasta/homo_sapiens/dna/Homo_sapiens.GRCh38.dna.primary_assembly.fa.gz

# Thống kê nhanh
seqkit stats data/*.fastq
```

Truy vấn NCBI bằng Python:

```python
from Bio import Entrez, SeqIO
Entrez.email = "ban@email.com"
handle = Entrez.efetch(db="nucleotide", id="NM_000546", rettype="fasta")
record = SeqIO.read(handle, "fasta")  # mRNA TP53
print(record.description, len(record.seq))
```

**Bài tập**

- [ ] Tìm một bộ dữ liệu RNA-seq ung thư trên GEO, ghi lại số mẫu, nhóm so sánh và mã SRA.
- [ ] Mở một file BAM mẫu trong IGV, quan sát read quanh gen TP53.
- [ ] Tra protein TP53 trên UniProt và AlphaFold DB, ghi lại các miền chức năng.

**Tài nguyên:** [Ensembl Training](https://www.ensembl.org/info/website/tutorials/index.html), [NCBI Learn](https://www.ncbi.nlm.nih.gov/learn/), [IGV](https://igv.org).

## Ghi chép khi học

-
