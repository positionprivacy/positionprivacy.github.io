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
    <p class="home-eyebrow">Artificial Intelligence undergraduate · Shanghai Jiao Tong University</p>
    <h2>Multimodal models, reasoning benchmarks, and AI agents.</h2>
    <p>
      I am an undergraduate student majoring in Artificial Intelligence at Shanghai Jiao Tong University.
      My recent research focuses on building evaluation benchmarks and applied model systems for clinical
      multimodal understanding, programmatic spatial-temporal reasoning, and long-horizon academic agents.
    </p>
    <div class="home-actions" aria-label="Primary links">
      <a class="home-button home-button--primary" href="{{ '/publications/' | relative_url }}"><i class="fas fa-book-open" aria-hidden="true"></i> Publications</a>
      <a class="home-button" href="https://github.com/positionprivacy"><i class="fab fa-github" aria-hidden="true"></i> GitHub</a>
      <a class="home-button" href="mailto:qrzhang_23@sjtu.edu.cn"><i class="fas fa-envelope" aria-hidden="true"></i> Email</a>
    </div>
  </div>
  <figure class="home-visual">
    <img src="{{ '/images/research-banner.png' | relative_url }}" alt="Abstract research visual with waveform, spatial grid, and agent trajectory motifs">
  </figure>
</section>

<section class="home-section">
  <h2>Research Interests</h2>
  <div class="interest-grid">
    <article>
      <span class="interest-kicker">Clinical AI</span>
      <h3>Fine-grained EEG interpretation</h3>
      <p>Vision-language models and data pipelines for richer clinical EEG understanding beyond narrow classification.</p>
    </article>
    <article>
      <span class="interest-kicker">Reasoning</span>
      <h3>Programmatic visual reasoning</h3>
      <p>Benchmarks and diagnostics for spatially coherent code generation across animated, temporal scenes.</p>
    </article>
    <article>
      <span class="interest-kicker">Agents</span>
      <h3>Academic task solving</h3>
      <p>Evaluation of AI agents on complex student-originated workflows that require planning, tools, and execution.</p>
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
      <div class="paper-card__meta">
        <span>ICLR 2026</span>
        <span>Multimodal Clinical AI</span>
      </div>
      <h3><a href="{{ '/publication/cerebragloss/' | relative_url }}">CerebraGloss: Instruction-Tuning a Large Vision-Language Model for Fine-Grained Clinical EEG Interpretation</a></h3>
      <p>Introduces an EEG-text instruction data engine, CerebraGloss-Bench, and an LVLM for generative clinical EEG interpretation.</p>
      <div class="paper-links">
        <a href="https://openreview.net/forum?id=Xi1jkajWi9">OpenReview</a>
        <a href="https://github.com/iewug/CerebraGloss">Code</a>
      </div>
    </article>

    <article class="paper-card">
      <div class="paper-card__meta">
        <span>arXiv 2026</span>
        <span>Spatial-Temporal Reasoning</span>
      </div>
      <h3><a href="{{ '/publication/prism/' | relative_url }}">PRISM: A Benchmark for Programmatic Spatial-Temporal Reasoning</a></h3>
      <p>A large-scale benchmark for evaluating whether language models can generate runnable code that also produces spatially coherent animations.</p>
      <div class="paper-links">
        <a href="https://arxiv.org/abs/2605.19382">arXiv</a>
        <a href="https://arxiv.org/pdf/2605.19382">PDF</a>
      </div>
    </article>

    <article class="paper-card">
      <div class="paper-card__meta">
        <span>arXiv 2026</span>
        <span>AI Agents</span>
      </div>
      <h3><a href="{{ '/publication/academi-claw/' | relative_url }}">AcademiClaw: When Students Set Challenges for AI Agents</a></h3>
      <p>A bilingual benchmark of complex, long-horizon academic tasks sourced from real university student workflows.</p>
      <div class="paper-links">
        <a href="https://arxiv.org/abs/2605.02661">arXiv</a>
        <a href="https://github.com/GAIR-NLP/AcademiClaw">Code</a>
      </div>
    </article>
  </div>
</section>

<section class="home-section">
  <h2>Updates</h2>
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
      I am interested in collaborations around multimodal model evaluation, code-generation benchmarks,
      and agent capabilities in realistic academic workflows.
    </p>
  </div>
  <a class="home-button home-button--primary" href="mailto:qrzhang_23@sjtu.edu.cn"><i class="fas fa-paper-plane" aria-hidden="true"></i> qrzhang_23@sjtu.edu.cn</a>
</section>
