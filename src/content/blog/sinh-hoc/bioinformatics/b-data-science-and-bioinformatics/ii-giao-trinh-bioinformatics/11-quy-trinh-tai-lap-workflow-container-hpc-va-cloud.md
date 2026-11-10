---
title: 'Phần 11 – Quy trình tái lập: workflow, container, HPC và cloud'
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - giao-trinh-bioinformatics
  - part-11
  - workflow
  - reproducibility
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / II - Giáo
  trình Bioinformatics
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/II -
  Giáo trình Bioinformatics/11 - Quy trình tái lập - workflow, container, HPC và
  cloud.md
status: chưa học
order: 11
description: >-
  Một phân tích chỉ có giá trị khi người khác (hoặc chính bạn sau 6 tháng) chạy
  lại được và ra cùng kết quả. Đây là kỹ năng phân biệt người mới học với
  bioinformatician chuyên nghiệp.
isIndex: false
---
Một phân tích chỉ có giá trị khi người khác (hoặc chính bạn sau 6 tháng) chạy lại được và ra cùng kết quả. Đây là kỹ năng phân biệt người mới học với bioinformatician chuyên nghiệp.

**Mục tiêu:** viết pipeline bằng workflow manager, đóng gói môi trường bằng container, chạy trên cụm máy tính hoặc cloud, và tổ chức dự án theo chuẩn.

## 11.1 Workflow manager

**Snakemake** (dựa trên Python): mỗi rule khai báo đầu vào, đầu ra và lệnh; Snakemake tự suy ra thứ tự và chỉ chạy lại phần thay đổi.

```python
SAMPLES = ["s1", "s2", "s3"]

rule all:
    input: expand("qc/{s}_fastqc.html", s=SAMPLES)

rule fastqc:
    input: "data/{s}.fastq.gz"
    output: "qc/{s}_fastqc.html"
    conda: "envs/qc.yaml"
    shell: "fastqc {input} -o qc/"
```

Chạy: `snakemake --cores 8 --use-conda`.

**Nextflow** và cộng đồng **nf-core** cung cấp hơn 100 pipeline đã kiểm định (nf-core/rnaseq, nf-core/sarek cho biến thể, nf-core/scrnaseq). Học cách chạy chúng trước khi tự viết:

```bash
nextflow run nf-core/rnaseq -profile docker --input samplesheet.csv --genome GRCh38 --outdir results
```

## 11.2 Container

- **Docker:** đóng gói công cụ và phụ thuộc vào một image chạy giống nhau trên mọi máy.
- **Apptainer (Singularity):** tương tự Docker nhưng chạy được trên cụm HPC không cần quyền root.
- Image dựng sẵn cho hầu hết công cụ: BioContainers (quay.io/biocontainers).

## 11.3 HPC và cloud

- **HPC:** nộp job qua bộ lập lịch SLURM (`sbatch`, `squeue`, `scancel`); khai báo CPU, RAM, thời gian chạy.
- **Cloud:** AWS, Google Cloud, Terra (cho dữ liệu genomics lớn), Galaxy (giao diện web).
- Ước lượng tài nguyên: căn chỉnh genome người một mẫu WGS 30x cần khoảng 16–32 GB RAM và nhiều giờ CPU; luôn thử trên tập con nhỏ trước.

## 11.4 Tổ chức dự án và tái lập

```
project/
├── data/raw/        # dữ liệu gốc, chỉ đọc
├── data/processed/
├── envs/            # file environment.yaml
├── workflow/        # Snakefile hoặc main.nf
├── notebooks/       # phân tích khám phá
├── results/
└── README.md        # mục đích, cách chạy, phiên bản
```

- Ghi phiên bản công cụ và genome tham chiếu (ví dụ GRCh38, Ensembl 110).
- Đặt seed ngẫu nhiên cho mọi bước có tính ngẫu nhiên.
- Không sửa dữ liệu gốc bằng tay; mọi biến đổi phải qua code.
- Báo cáo bằng Quarto hoặc Jupyter để code, kết quả và giải thích nằm cùng chỗ.

**Bài tập**

- [ ] Chuyển pipeline QC → căn chỉnh → gọi biến thể của Phần 6 thành Snakemake có môi trường conda riêng cho mỗi rule.
- [ ] Chạy nf-core/rnaseq với profile `test` để làm quen.
- [ ] Viết một Dockerfile cài Python, pandas và Biopython, chạy script GC content bên trong container.

**Tài nguyên:** [Snakemake tutorial](https://snakemake.readthedocs.io), [nf-core](https://nf-co.re), [Nextflow Training](https://training.nextflow.io), [The Turing Way](https://the-turing-way.netlify.app) (hướng dẫn nghiên cứu tái lập).

## Ghi chép khi học

-
