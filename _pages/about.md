---
permalink: /
title: "Qiran Zhang"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

<section class="home-hero">
  <div class="home-hero__copy">
    <p class="home-eyebrow">Qiran Zhang / Artificial Intelligence / Shanghai</p>
    <h2>I study how machines read signals, space, and tasks.</h2>
    <p class="home-intro">
      I am an undergraduate student majoring in Artificial Intelligence at Shanghai Jiao Tong University.
      My recent work moves between clinical EEG interpretation, programmatic spatial-temporal reasoning,
      and the evaluation of AI agents in realistic academic workflows.
    </p>
    <div class="home-notes" aria-label="Research notes">
      <p>
        <span>Signal</span>
        From EEG traces to fine-grained clinical language.
      </p>
      <p>
        <span>Space</span>
        From programs to coherent temporal worlds.
      </p>
      <p>
        <span>Task</span>
        From student challenges to agent evaluation.
      </p>
    </div>
    <div class="home-actions" aria-label="Primary links">
      <a class="home-button home-button--primary" href="{{ '/publications/' | relative_url }}"><i class="fas fa-book-open" aria-hidden="true"></i> Publications</a>
      <a class="home-button" href="https://github.com/positionprivacy"><i class="fab fa-github" aria-hidden="true"></i> GitHub</a>
      <a class="home-button" href="mailto:qrzhang_23@sjtu.edu.cn"><i class="fas fa-envelope" aria-hidden="true"></i> Email</a>
    </div>
  </div>
  <figure class="home-visual">
    <img src="{{ '/images/research-banner.png' | relative_url }}" alt="Abstract research visual with waveform, spatial grid, and agent trajectory motifs">
    <figcaption>Signals, programs, and agent tasks sketched as a shared field of measurement.</figcaption>
  </figure>
</section>

<section class="home-section">
  <div class="section-heading">
    <h2>Research Threads</h2>
    <span>Current questions</span>
  </div>
  <div class="focus-list">
    <article>
      <span class="thread-number">01</span>
      <div>
        <span class="interest-kicker">Clinical AI</span>
        <h3>When signals become language</h3>
        <p>Vision-language models and instruction data for richer EEG interpretation beyond narrow labels.</p>
      </div>
    </article>
    <article>
      <span class="thread-number">02</span>
      <div>
        <span class="interest-kicker">Reasoning</span>
        <h3>When code has to keep its geometry</h3>
        <p>Benchmarks and diagnostics for models that generate runnable programs for animated spatial worlds.</p>
      </div>
    </article>
    <article>
      <span class="thread-number">03</span>
      <div>
        <span class="interest-kicker">Agents</span>
        <h3>When tasks refuse to be toy tasks</h3>
        <p>Agent evaluation on long-horizon academic workflows that require planning, tools, and execution.</p>
      </div>
    </article>
  </div>
</section>

<section class="home-section">
  <div class="section-heading">
    <h2>Selected Work</h2>
    <a href="{{ '/publications/' | relative_url }}">All publications</a>
  </div>
  <div class="paper-list">
    <article class="paper-card">
      <span class="paper-number">01</span>
      <div class="paper-card__meta">
        <span>ICLR 2026</span>
        <span>Multimodal Clinical AI</span>
      </div>
      <h3><a href="{{ '/publication/cerebragloss/' | relative_url }}">CerebraGloss: Instruction-Tuning a Large Vision-Language Model for Fine-Grained Clinical EEG Interpretation</a></h3>
      <p>An EEG-text instruction data engine, CerebraGloss-Bench, and a large vision-language model for generative clinical EEG interpretation.</p>
      <div class="paper-links">
        <a href="https://openreview.net/forum?id=Xi1jkajWi9">OpenReview</a>
        <a href="https://github.com/iewug/CerebraGloss">Code</a>
      </div>
    </article>

    <article class="paper-card">
      <span class="paper-number">02</span>
      <div class="paper-card__meta">
        <span>arXiv 2026</span>
        <span>Spatial-Temporal Reasoning</span>
      </div>
      <h3><a href="{{ '/publication/prism/' | relative_url }}">PRISM: A Benchmark for Programmatic Spatial-Temporal Reasoning</a></h3>
      <p>A benchmark for testing whether language models can write runnable code that also preserves spatial and temporal coherence.</p>
      <div class="paper-links">
        <a href="https://arxiv.org/abs/2605.19382">arXiv</a>
        <a href="https://arxiv.org/pdf/2605.19382">PDF</a>
      </div>
    </article>

    <article class="paper-card">
      <span class="paper-number">03</span>
      <div class="paper-card__meta">
        <span>arXiv 2026</span>
        <span>AI Agents</span>
      </div>
      <h3><a href="{{ '/publication/academi-claw/' | relative_url }}">AcademiClaw: When Students Set Challenges for AI Agents</a></h3>
      <p>A bilingual benchmark of long-horizon academic tasks, sourced from real student workflows rather than simplified prompts.</p>
      <div class="paper-links">
        <a href="https://arxiv.org/abs/2605.02661">arXiv</a>
        <a href="https://github.com/GAIR-NLP/AcademiClaw">Code</a>
      </div>
    </article>
  </div>
</section>

<section class="home-section">
  <h2>Notes</h2>
  <div class="timeline">
    <div>
      <time>2026</time>
      <p><strong>CerebraGloss</strong> accepted to ICLR 2026.</p>
    </div>
    <div>
      <time>2026</time>
      <p><strong>PRISM</strong> and <strong>AcademiClaw</strong> released as public research benchmarks.</p>
    </div>
  </div>
</section>

<section class="home-section contact-panel" id="contact">
  <div>
    <h2>Contact</h2>
    <p>
      I am interested in conversations around multimodal model evaluation, code-generation benchmarks,
      and agent capabilities in realistic academic workflows.
    </p>
  </div>
  <a class="home-button home-button--primary" href="mailto:qrzhang_23@sjtu.edu.cn"><i class="fas fa-paper-plane" aria-hidden="true"></i> qrzhang_23@sjtu.edu.cn</a>
</section>
