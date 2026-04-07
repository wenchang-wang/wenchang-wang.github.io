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

      /* Homepage — About */
      about_title: 'About Me',
      about_p1: 'I am Wenchang Wang, currently a master\'s student at Peking University, majoring in Journalism and Communication with a minor in Economics. I will start my Ph.D. in Media, Technology, and Society (MTS) at Northwestern University in Fall 2026, where I will work with <a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Associate Professor Emoke-Agnes Horvat</a>.',
      about_p2: 'My research focuses on <strong>political communication</strong>, primarily using <strong>computational methods</strong> to study political phenomena in <strong>online communities</strong>. My specific research interests include:',
      about_li1: 'User behavior following <strong>platform policy changes</strong>',
      about_li2: '<strong>Off-topic discussion</strong> phenomena and causes in online communities',
      about_li3: 'Advanced <strong>multimodal data analysis</strong> and processing methods',
      about_p3: 'My research centers on <strong>computational social science</strong> and <strong>causal inference</strong>, with a goal of bridging classic communication theories and modern computational approaches in digital environments. My papers have been accepted at conferences including <strong><em>ICA</em></strong>, <strong><em>NCA</em></strong>, <strong><em>AEJMC</em></strong>, and <strong><em>IC\u00B2S\u00B2</em></strong>. My work has received recognition including the <strong>Top Student Paper</strong> at <strong>AEJMC</strong>, the <strong>Promising Student Paper</strong> at <strong>ICA</strong>, and the <strong>Best Faculty Paper Award</strong> (<strong>ICCA Division</strong>) at the <strong>ICA 76th Annual Conference</strong> in 2026.',

      /* Homepage — News */
      news_title: 'News',
      news_1: 'I have decided to join Northwestern University this fall and start my Ph.D. journey at the School of Communication, where I will work with <a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Associate Professor Emoke-Agnes Horvat</a>.',
      news_2: 'Two of my papers were accepted by ICA, and I will give two in-person presentations on June 5.',

      /* Homepage — Education */
      edu_title: 'Education',
      edu_nu_name: 'Northwestern University',
      edu_nu_degree: 'Ph.D. in Media, Technology, and Society (MTS) (Admitted)',
      edu_nu_date: 'Fall 2026 (Expected) | Evanston, IL, USA',
      edu_nu_note: 'Advisor: Associate Professor Emoke-Agnes Horvat',
      edu_pku_name: 'Peking University',
      edu_pku_degree: 'M.A. in Journalism and Communication; Minor in Economics',
      edu_pku_date: 'Aug 2023 \u2013 June 2026 | Shenzhen, Guangdong',
      edu_pku_note: 'Advisor: Assistant Professor Zhuo Chen',
      edu_koeln_name: 'University of Cologne',
      edu_koeln_degree: 'Exchange Student in Economics and Information Science',
      edu_koeln_date: 'Oct 2024 \u2013 Mar 2025 | Cologne, Germany',
      edu_koeln_note: 'Exchange coursework during graduate study at Peking University',
      edu_suda_name: 'Soochow University',
      edu_suda_degree: 'B.E. in Mechanical and Electronic Engineering',
      edu_suda_date: 'Sept 2017 \u2013 June 2021 | Suzhou, Jiangsu',

      /* Homepage — Awards */
      awards_title: 'Awards',
      award_1: 'Best Faculty Paper, ICA 76th Annual Conference (ICCA Division)',
      award_2: 'National Scholarship of China',
      award_3: 'Promising Student Paper, ICA 75th Annual Conference',
      award_4: 'Award of Scientific Research, Peking University',
      award_5: 'Top Student Paper, AEJMC 107th Annual Conference',

      /* CV */
      cv_title: 'Curriculum Vitae',
      cv_subtitle: 'Academic background, publications, and milestones.',
      cv_download: 'Download CV (PDF)',
      cv_education: 'Education',
      cv_skills: 'Skills',
      skill_methods: 'Research Methods',
      skill_programming: 'Programming & Tools',
      skill_languages: 'Languages',

      /* Research */
      research_title: 'Research',
      research_subtitle: 'Questions, methods, and evidence from digital society.',
      filter_all: 'All',
      filter_published: 'Published',
      filter_conference: 'Conference',
      filter_award: 'Award',
      research_recent: 'Recent Research',
      research_conference: 'Peer-Reviewed Conference',
      research_wip: 'Works in Progress',

      /* Blog */
      blog_title: 'Blog',
      blog_subtitle: 'Code, methods, conference notes, and reflections.',
      blog_stat_articles: 'Articles',
      blog_stat_words: 'Words',
      blog_read_more: 'Read More \u2192',

      /* Contact */
      contact_title: 'Contact',
      contact_subtitle: 'Feel free to reach out for research collaboration or academic discussion.',
      contact_email_label: 'Email',
      contact_twitter_label: 'X (Twitter)',
      contact_github_label: 'GitHub',
      contact_cmd: 'echo "Send me a message"',
      contact_success_msg: '✓ Message prepared! Opening email client...',
    },

    zh: {
      /* Nav */
      nav_home: '\u9996\u9875',
      nav_cv: '\u7b80\u5386',
      nav_research: '\u7814\u7a76',
      nav_blog: '\u535a\u5ba2',
      nav_contact: '\u8054\u7cfb',

      /* Homepage — Hero */
      hero_tagline: '\u8ba1\u7b97\u793e\u4f1a\u79d1\u5b66',
      hero_subtitle: '\u7528\u6570\u636e\u3001\u4ee3\u7801\u548c\u56e0\u679c\u63a8\u65ad\u6784\u5efa\u7406\u8bba\u3002',

      /* Homepage — About */
      about_title: '\u5173\u4e8e\u6211',
      about_p1: '\u6211\u662f\u738b\u6587\u957f\uff0c\u76ee\u524d\u662f\u5317\u4eac\u5927\u5b66\u65b0\u95fb\u4e0e\u4f20\u64ad\u5b66\u9662\u7684\u7855\u58eb\u7814\u7a76\u751f\uff0c\u8f85\u4fee\u7ecf\u6d4e\u5b66\u3002\u6211\u5c06\u4e8e 2026 \u5e74\u79cb\u5b63\u5728\u7f8e\u56fd\u897f\u5317\u5927\u5b66\u5f00\u59cb\u5a92\u4f53\u3001\u6280\u672f\u4e0e\u793e\u4f1a\uff08MTS\uff09\u535a\u58eb\u7814\u7a76\uff0c\u5e08\u4ece <a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Emoke-Agnes Horvat \u526f\u6559\u6388</a>\u3002',
      about_p2: '\u6211\u7684\u7814\u7a76\u805a\u7126\u4e8e<strong>\u653f\u6cbb\u4f20\u64ad</strong>\uff0c\u4e3b\u8981\u4f7f\u7528<strong>\u8ba1\u7b97\u65b9\u6cd5</strong>\u7814\u7a76<strong>\u7f51\u7edc\u793e\u533a</strong>\u4e2d\u7684\u653f\u6cbb\u73b0\u8c61\u3002\u5177\u4f53\u7814\u7a76\u5174\u8da3\u5305\u62ec\uff1a',
      about_li1: '<strong>\u5e73\u53f0\u653f\u7b56\u53d8\u52a8</strong>\u540e\u7684\u7528\u6237\u884c\u4e3a',
      about_li2: '\u7f51\u7edc\u793e\u533a\u4e2d\u7684<strong>\u8ddf\u5e16\u8bdd\u9898\u504f\u79bb</strong>\u73b0\u8c61\u53ca\u539f\u56e0',
      about_li3: '\u5148\u8fdb\u7684<strong>\u591a\u6a21\u6001\u6570\u636e\u5206\u6790</strong>\u4e0e\u5904\u7406\u65b9\u6cd5',
      about_p3: '\u6211\u7684\u7814\u7a76\u4ee5<strong>\u8ba1\u7b97\u793e\u4f1a\u79d1\u5b66</strong>\u548c<strong>\u56e0\u679c\u63a8\u65ad</strong>\u4e3a\u6838\u5fc3\uff0c\u81f4\u529b\u4e8e\u5728\u6570\u5b57\u73af\u5883\u4e2d\u8fde\u63a5\u7ecf\u5178\u4f20\u64ad\u7406\u8bba\u4e0e\u73b0\u4ee3\u8ba1\u7b97\u65b9\u6cd5\u3002\u6211\u7684\u8bba\u6587\u5df2\u88ab <strong><em>ICA</em></strong>\u3001<strong><em>NCA</em></strong>\u3001<strong><em>AEJMC</em></strong> \u548c <strong><em>IC\u00B2S\u00B2</em></strong> \u7b49\u4f1a\u8bae\u5f55\u7528\u3002\u6211\u7684\u7814\u7a76\u83b7\u5f97\u4e86\u591a\u9879\u8363\u8a89\uff0c\u5305\u62ec <strong>AEJMC</strong> \u7684 <strong>Top Student Paper</strong>\u3001<strong>ICA</strong> \u7684 <strong>Promising Student Paper</strong>\uff0c\u4ee5\u53ca 2026 \u5e74 <strong>ICA \u7b2c76\u5c4a\u5e74\u4f1a</strong>\u7684 <strong>Best Faculty Paper Award</strong>\uff08<strong>ICCA Division</strong>\uff09\u3002',

      /* Homepage — News */
      news_title: '\u6700\u65b0\u52a8\u6001',
      news_1: '\u6211\u5df2\u51b3\u5b9a\u4eca\u5e74\u79cb\u5b63\u52a0\u5165\u7f8e\u56fd\u897f\u5317\u5927\u5b66\u4f20\u64ad\u5b66\u9662\uff0c\u5f00\u542f\u535a\u58eb\u7814\u7a76\u751f\u4e4b\u65c5\uff0c\u5e08\u4ece <a href="https://agneshorvat.soc.northwestern.edu/" target="_blank">Emoke-Agnes Horvat \u526f\u6559\u6388</a>\u3002',
      news_2: '\u6211\u7684\u4e24\u7bc7\u8bba\u6587\u88ab ICA \u5f55\u7528\uff0c\u5c06\u4e8e 6 \u6708 5 \u65e5\u8fdb\u884c\u4e24\u573a\u73b0\u573a\u62a5\u544a\u3002',

      /* Homepage — Education */
      edu_title: '\u6559\u80b2\u80cc\u666f',
      edu_nu_name: '\u7f8e\u56fd\u897f\u5317\u5927\u5b66',
      edu_nu_degree: '\u5a92\u4f53\u3001\u6280\u672f\u4e0e\u793e\u4f1a\uff08MTS\uff09\u535a\u58eb\uff08\u5df2\u5f55\u53d6\uff09',
      edu_nu_date: '2026\u5e74\u79cb\u5b63\uff08\u9884\u671f\uff09| \u4f0a\u6587\u65af\u987f\uff0c\u7f8e\u56fd',
      edu_nu_note: '\u5bfc\u5e08\uff1aEmoke-Agnes Horvat \u526f\u6559\u6388',
      edu_pku_name: '\u5317\u4eac\u5927\u5b66',
      edu_pku_degree: '\u65b0\u95fb\u4e0e\u4f20\u64ad\u5b66\u7855\u58eb\uff1b\u8f85\u4fee\u7ecf\u6d4e\u5b66',
      edu_pku_date: '2023\u5e748\u6708 \u2013 2026\u5e746\u6708 | \u6df1\u5733',
      edu_pku_note: '\u5bfc\u5e08\uff1a\u9648\u707c \u52a9\u7406\u6559\u6388',
      edu_koeln_name: '\u5fb7\u56fd\u79d1\u9686\u5927\u5b66',
      edu_koeln_degree: '\u7ecf\u6d4e\u5b66\u4e0e\u4fe1\u606f\u79d1\u5b66\u4ea4\u6362\u751f',
      edu_koeln_date: '2024\u5e7410\u6708 \u2013 2025\u5e743\u6708 | \u79d1\u9686\uff0c\u5fb7\u56fd',
      edu_koeln_note: '\u5317\u4eac\u5927\u5b66\u7855\u58eb\u671f\u95f4\u4ea4\u6362\u5b66\u4e60',
      edu_suda_name: '\u82cf\u5dde\u5927\u5b66',
      edu_suda_degree: '\u673a\u68b0\u7535\u5b50\u5de5\u7a0b\u5b66\u58eb',
      edu_suda_date: '2017\u5e749\u6708 \u2013 2021\u5e746\u6708 | \u82cf\u5dde',

      /* Homepage — Awards */
      awards_title: '\u8363\u8a89\u5956\u9879',
      award_1: 'Best Faculty Paper\uff0cICA \u7b2c76\u5c4a\u5e74\u4f1a\uff08ICCA Division\uff09',
      award_2: '\u56fd\u5bb6\u5956\u5b66\u91d1',
      award_3: 'Promising Student Paper\uff0cICA \u7b2c75\u5c4a\u5e74\u4f1a',
      award_4: '\u5317\u4eac\u5927\u5b66\u79d1\u7814\u5956',
      award_5: 'Top Student Paper\uff0cAEJMC \u7b2c107\u5c4a\u5e74\u4f1a',

      /* CV */
      cv_title: '\u4e2a\u4eba\u7b80\u5386',
      cv_subtitle: '\u5b66\u672f\u80cc\u666f\u3001\u53d1\u8868\u4e0e\u91cc\u7a0b\u7891\u3002',
      cv_download: '\u4e0b\u8f7d\u7b80\u5386 (PDF)',
      cv_education: '\u6559\u80b2\u80cc\u666f',
      cv_skills: '\u6280\u80fd',
      skill_methods: '\u7814\u7a76\u65b9\u6cd5',
      skill_programming: '\u7f16\u7a0b\u4e0e\u5de5\u5177',
      skill_languages: '\u8bed\u8a00',

      /* Research */
      research_title: '\u7814\u7a76',
      research_subtitle: '\u6570\u5b57\u793e\u4f1a\u4e2d\u7684\u95ee\u9898\u3001\u65b9\u6cd5\u4e0e\u8bc1\u636e\u3002',
      filter_all: '\u5168\u90e8',
      filter_published: '\u5df2\u53d1\u8868',
      filter_conference: '\u4f1a\u8bae',
      filter_award: '\u83b7\u5956',
      research_recent: '\u8fd1\u671f\u7814\u7a76',
      research_conference: '\u540c\u884c\u8bc4\u5ba1\u4f1a\u8bae',
      research_wip: '\u8fdb\u884c\u4e2d\u7684\u7814\u7a76',

      /* Blog */
      blog_title: '\u535a\u5ba2',
      blog_subtitle: '\u4ee3\u7801\u3001\u65b9\u6cd5\u3001\u4f1a\u8bae\u7b14\u8bb0\u4e0e\u601d\u8003\u3002',
      blog_stat_articles: '\u7bc7\u6587\u7ae0',
      blog_stat_words: '\u5b57',
      blog_read_more: '\u9605\u8bfb\u66f4\u591a \u2192',

      /* Contact */
      contact_title: '\u8054\u7cfb\u6211',
      contact_subtitle: '\u6b22\u8fce\u5c31\u7814\u7a76\u5408\u4f5c\u6216\u5b66\u672f\u8ba8\u8bba\u4e0e\u6211\u8054\u7cfb\u3002',
      contact_email_label: '\u90ae\u7bb1',
      contact_twitter_label: 'X (Twitter)',
      contact_github_label: 'GitHub',
      contact_cmd: 'echo "\u7ed9\u6211\u7559\u8a00"',
      contact_success_msg: '\u2713 \u90ae\u4ef6\u5df2\u51c6\u5907\uff01\u6b63\u5728\u6253\u5f00\u90ae\u4ef6\u5ba2\u6237\u7aef\u2026',
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
      toggle.addEventListener('click', function () {
        window.I18n.toggle();
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
