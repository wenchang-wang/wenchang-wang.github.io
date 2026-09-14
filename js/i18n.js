/**
 * i18n.js — Bilingual (EN/ZH) content switching system.
 * All translatable text stored here. Elements with data-i18n="key"
 * get their textContent updated on language switch.
 * Elements with data-i18n-html="key" get innerHTML updated.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'lang';

  var i18n = {
    en: {
      /* Nav */
      nav_home: 'Home',
      nav_cv: 'CV',
      nav_research: 'Research',
      nav_blog: 'Blog',
      nav_contact: 'Contact',

      /* Homepage — Hero */
      hero_tagline: 'Computational Social Science',
      hero_subtitle: 'Build theories with data, code, and causal inference.',
      scroll_explore: '🎮 PRESS ↓ OR SCROLL TO EXPLORE',

      /* Homepage — About */
      about_title: 'About Me',
      about_p1: 'I am <strong>Wenchang Wang</strong>, a Ph.D. student in Media, Technology, and Society (MTS) at <strong>Northwestern University</strong>, advised by <a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Associate Professor Ágnes Horvát</a>.',
      about_p2: 'My research interests center on using <strong>computational methods</strong> and <strong>causal inference</strong> to study how people interact with <strong>online platforms</strong>. Specifically, my research focuses on:',
      about_li1: 'How <strong>policy changes</strong> (e.g., platform policy changes and macro-political environments) and <strong>technological changes</strong> (e.g., the emergence of large language models) affect human behavior',
      about_li2: 'Methods for measuring <strong>multimodal information</strong> (e.g., text and images) on online platforms',
      about_li3: 'How to conduct <strong>less-biased causal inference</strong> with large-scale datasets',
      about_p3: 'My papers have appeared at conferences including <strong><em>CSCW</em></strong>, <strong><em>ICA</em></strong>, <strong><em>AEJMC</em></strong>, and <strong><em>IC²S²</em></strong>. I have received the <strong>Top Student Paper</strong> award at <strong>AEJMC</strong>, as well as the <strong>Promising Student Paper</strong> and the <strong>Best Faculty Paper Award</strong> at <strong>ICA</strong>.',

      /* Homepage — News */
      news_title: 'Latest Updates',
      news_1: 'I have decided to join <strong>Northwestern University</strong> this fall to start my Ph.D. journey at the School of Communication, working with <a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Associate Professor Ágnes Horvát</a>.',
      news_2: 'Two of my papers were accepted by <strong>ICA 2026</strong>, including the <strong>Best Faculty Paper Award</strong> at ICCA Division!',
      news_3: 'I will present two posters with my collaborators at <strong>CSCW 2026</strong>, discussing how large language models influence knowledge production and collaboration.',

      /* Homepage — Education */
      edu_title: 'Education',
      edu_nu_name: 'Northwestern University',
      edu_nu_degree: 'Ph.D. in Media, Technology, and Society (MTS)',
      edu_nu_date: '2026-2031 (Expected) | Evanston, IL, USA',
      edu_nu_note: 'Advisor: <a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Associate Professor Ágnes Horvát</a>',
      edu_pku_name: 'Peking University',
      edu_pku_degree: 'M.A. in Journalism and Communication; Minor in Economics',
      edu_pku_date: 'Aug 2023 – June 2026 | Shenzhen, Guangdong',
      edu_pku_note: 'Advisor: Assistant Professor Zhuo Chen',
      edu_koeln_name: 'University of Cologne',
      edu_koeln_degree: 'Exchange Student in Economics and Information Science',
      edu_koeln_date: 'Oct 2024 – Mar 2025 | Cologne, Germany',
      edu_koeln_note: 'Exchange coursework during graduate study at Peking University',
      edu_suda_name: 'Soochow University',
      edu_suda_degree: 'B.E. in Mechanical and Electronic Engineering',
      edu_suda_date: 'Sept 2017 – June 2021 | Suzhou, Jiangsu',

      /* CV */
      cv_title: 'Curriculum Vitae',
      cv_download_heading: 'Download Complete Curriculum Vitae',
      cv_download_desc: 'PDF document containing complete academic achievements, publications, and background.',
      cv_download: 'Download CV (PDF)',

      /* Research */
      research_title: 'Selected Publications & Conferences',

      /* Blog */
      blog_title: 'Academic Blog & Notes',

      /* Contact */
      contact_title: 'Contact & Communication',
    },

    zh: {
      /* Nav */
      nav_home: '首页',
      nav_cv: '简历',
      nav_research: '研究',
      nav_blog: '博客',
      nav_contact: '联系',

      /* Homepage — Hero */
      hero_tagline: '计算社会科学',
      hero_subtitle: '用数据、代码和因果推断构建理论。',
      scroll_explore: '🎮 点击 ↓ 或向下滑动浏览',

      /* Homepage — About */
      about_title: '关于我',
      about_p1: '我是<strong>王文长</strong>，目前是美国<strong>西北大学</strong>媒体、技术与社会（MTS）博士生，导师是<a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Ágnes Horvát 副教授</a>。',
      about_p2: '我的研究兴趣主要是使用<strong>计算方法</strong>和<strong>因果推断</strong>研究人们与<strong>在线平台</strong>的互动。具体而言，我的研究领域包括：',
      about_li1: '<strong>政策变化</strong>（例如平台政策变化和宏观政治环境）与<strong>技术变化</strong>（例如大语言模型的出现）对人类行为产生的影响',
      about_li2: '对在线平台中<strong>多种模态信息</strong>（例如文本和图片）的测量方法',
      about_li3: '如何在大型数据集上进行<strong>更少偏误的因果推断</strong>',
      about_p3: '我的文章发表于<strong><em>CSCW</em></strong>、<strong><em>ICA</em></strong>、<strong><em>AEJMC</em></strong>、<strong><em>IC²S²</em></strong>等会议。我已经获得了<strong>AEJMC</strong>的<strong>Top Student Paper</strong>，以及<strong>ICA</strong>的<strong>Promising Student Paper</strong>和<strong>Best Faculty Paper Award</strong>。',

      /* Homepage — News */
      news_title: '最新动态',
      news_1: '我已决定今年秋季加入<strong>美国西北大学</strong>传播学院，开启博士研究生之旅，师从 <a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Ágnes Horvát 副教授</a>。',
      news_2: '我的两篇论文被 <strong>ICA 2026</strong> 录用，并荣获 ICCA 分部的 <strong>Best Faculty Paper Award</strong>！',
      news_3: '我将与合作者在今年的<strong>CSCW 2026</strong>上展示两篇 poster，讨论大语言模型如何影响人们的知识生产与合作。',

      /* Homepage — Education */
      edu_title: '教育背景',
      edu_nu_name: '美国西北大学',
      edu_nu_degree: '媒体、技术与社会（MTS）博士',
      edu_nu_date: '2026-2031（预期）| 伊文斯顿，美国',
      edu_nu_note: '导师：<a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Ágnes Horvát 副教授</a>',
      edu_pku_name: '北京大学',
      edu_pku_degree: '新闻与传播学硕士；辅修经济学',
      edu_pku_date: '2023年8月 – 2026年6月 | 深圳',
      edu_pku_note: '导师：陈灼 助理教授',
      edu_koeln_name: '德国科隆大学',
      edu_koeln_degree: '经济学与信息科学交换生',
      edu_koeln_date: '2024年10月 – 2025年3月 | 科隆，德国',
      edu_koeln_note: '北京大学硕士期间交换学习',
      edu_suda_name: '苏州大学',
      edu_suda_degree: '机械电子工程学士',
      edu_suda_date: '2017年9月 – 2021年6月 | 苏州',

      /* CV */
      cv_title: '个人简历',
      cv_download_heading: '下载完整简历文档',
      cv_download_desc: '包含完整学术成果、发表论文及科研履历的 PDF 文件。',
      cv_download: '下载简历 (PDF)',

      /* Research */
      research_title: '学术发表与会议论文',

      /* Blog */
      blog_title: '学术博客与手记',

      /* Contact */
      contact_title: '联系与交流',
    }
  };

  function getDefaultLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }

  function applyLang(lang) {
    var dict = i18n[lang];
    if (!dict) return;

    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll('.lang-toggle').forEach(function (toggle) {
      toggle.setAttribute('data-lang', lang);
      toggle.querySelectorAll('.lang-option').forEach(function (opt) {
        opt.classList.toggle('active', opt.getAttribute('data-value') === lang);
      });
    });

    if (window.HomepageModule && typeof window.HomepageModule.retypeSubtitle === 'function') {
      window.HomepageModule.retypeSubtitle();
    }
  }

  function toggle() {
    var current = document.documentElement.getAttribute('data-lang') || 'en';
    applyLang(current === 'en' ? 'zh' : 'en');
  }

  function getCurrentLang() {
    return document.documentElement.getAttribute('data-lang') || 'en';
  }

  function t(key) {
    var lang = getCurrentLang();
    return (i18n[lang] && i18n[lang][key]) || key;
  }

  function init() {
    applyLang(getDefaultLang());

    document.querySelectorAll('.lang-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        var opt = e.target.closest('.lang-option');
        if (opt) {
          var val = opt.getAttribute('data-value');
          if (val) {
            applyLang(val);
            return;
          }
        }
        toggle();
      });
    });
  }

  window.I18n = {
    apply: applyLang,
    toggle: toggle,
    t: t,
    getCurrentLang: getCurrentLang,
    data: i18n
  };

  if (document.readyState === 'complete') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
