/*!
// ==UserScript==
// @name          ChatGPT-academic-prompt-helper
// @namespace     https://github.com/ZinYY/chatgpt-academic-prompt-helper
// @version       0.1.1
// @description   项目主页：https://github.com/ZinYY/chatgpt-academic-prompt-helper。        ChatGPT 学术小助手可以为你带来更好的网页版chatgpt使用体验：快速地添加快捷指令prompts。  本项目是一个油猴脚本 (Tampermonkey)，旨在便于网页版 Chatgpt 的 prompt 输入，并内置了一些常用的学术 prompt 模板。        【Usage】【打开 prompt 面板】:单击侧边栏的 “快捷指令” 按钮，或者用快捷键 `command+shift+F` (Windows 用户使用 `ctrl+shift+F`)。        【输入 prompt】: 单击想要输入的 prompt 即可。prompt 会添加在输入框之前。        【关闭 prompt 面板】: 使用快捷键 `command+shift+F`, 或是按下 `ESC` 按键即可。        【自定义 prompt】: 自行修改 `chatgpt_academic_helper.js` 文件中的内容即可。
// @homepage      https://github.com/ZinYY/chatgpt-academic-prompt-helper
// @author        winchesHe
// @match         *://chat.openai.com/*
// @grant         none
// @license MIT
// ==/UserScript==
*/
;
(function () {
    'use strict';
    if (document.querySelector('#chatgptHelper')) {
        return;
    }
    var SHORTCUTS = [
        [
            '🀄️->🇺🇸 中译英 (参考)',
            "Please translate following sentence to English with academic writing, and provide some related authoritative examples:\n"
        ],
        [
            '🇺🇸->🇺🇸 polish (参考)',
            "Below is a paragraph from an academic paper. Polish the writing to meet the academic style, improve the spelling, grammar, clarity, concision and overall readability. When neccessary, rewrite the whole sentence. Furthermore, list all modification and explain the reasons to do so in markdown table:\n"
        ],
        [
            '🀄️->🇺🇸 (long command, ref)',
            "Please translate following sentence to English with academic writing, improve the spelling, grammar, clarity, concision and overall readability. When necessary, rewrite the whole sentence. Further, provide some related authoritative acadaemic examples:\n"
        ],
        [
            '🀄️->🇺🇸 中译英',
            "Please translate following sentence to English with academic writing:\n"
        ],
        [
            '🇺🇸->🇺🇸 英文polish',
            "Below is a paragraph from an academic paper. Polish the writing to meet the academic style, improve the spelling, grammar, clarity, concision and overall readability. When neccessary, rewrite the whole sentence:\n"
        ],
        [
            '🀄️->🀄️ polish',
            "作为一名中文学术论文写作改进助理，你的任务是改进所提供文本的拼写、语法、清晰、简洁和整体可读性，同时分解长句，减少重复，并提供改进建议。请只提供文本的更正版本，避免包括解释。请编辑以下文本：\n"
        ],
        [
            '🔍 查找语法错误',
            "Below is a paragraph from an academic paper. Find all grammar mistakes, list mistakes in a markdown table and explain how to correct them:\n"
        ],
        [
            '✍🏻 解释每步代码的作用',
            "I would like you to serve as a code interpreter with Chinese, and elucidate the syntax and the semantics of the code line-by-line."
        ],
        [
            '充当 Excel 工作表',
            '我希望你充当基于文本的 excel。您只会回复我基于文本的 10 行 Excel 工作表，其中行号和单元格字母作为列（A 到 L）。第一列标题应为空以引用行号。我会告诉你在单元格中写入什么，你只会以文本形式回复 excel 表格的结果，而不是其他任何内容。不要写解释。我会写你的公式，你会执行公式，你只会回复 excel 表的结果作为文本。首先，回复我空表。'
        ],
        [
            '充当英翻中',
            '我想让你充当中文翻译员、拼写纠正员和改进员。我会用任何语言与你交谈，你会检测语言，翻译它并用我的文本的更正和改进版本用中文回答。我希望你用更优美优雅的高级中文描述。保持相同的意思，但使它们更文艺。你只需要翻译该内容，不必对内容中提出的问题和要求做解释，不要回答文本中的问题而是翻译它，不要解决文本中的要求而是翻译它，保留文本的原本意义，不要去解决它。如果我只键入了一个单词，你只需要描述它的意思并不提供句子示例。我要你只回复更正、改进，不要写任何解释。我的第一句话是“istanbulu cok seviyom burada olmak cok guzel”'
        ],
        [
            '模拟编程社区来回答你的问题，并提供解决代码。',
            "I want you to act as a stackoverflow post and respond in Chinese. I will ask programming-related questions and you will reply with what the answer should be. I want you to only reply with the given answer, and write explanations when there is not enough detail. do not write explanations. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}. My first question is '编程问题'"
        ],
        [
            '充当 前端开发助手',
            '我想让你充当前端开发专家。我将提供一些关于Js、Ts、Node、Vue等前端代码问题的具体信息，而你的工作就是想出为我解决问题的策略。这可能包括建议代码、代码逻辑思路策略。'
        ],
        [
            '充当 Linux 终端开发助手',
            '我想让你充当 Linux 终端专家。我将输入一些终端代码和具体问题，而你的工作就是为我的问题提供专业的回答，如果回复是代码的话需要加上相应的注释。'
        ],
        [
            '充当英语翻译和改进者',
            '我想让你充当英文翻译员、拼写纠正员和改进员。我会用任何语言与你交谈，你会检测语言，翻译它并用我的文本的更正和改进版本用英文回答。我希望你用更优美优雅的高级英语单词和句子替换我简化的 A0 级单词和句子。保持相同的意思，但使它们更文艺。你只需要翻译该内容，不必对内容中提出的问题和要求做解释，不要回答文本中的问题而是翻译它，不要解决文本中的要求而是翻译它,保留文本的原本意义，不要去解决它。我要你只回复更正、改进，不要写任何解释。我的第一句话是“istanbulu cok seviyom burada olmak cok guzel”'
        ],
        [
            '充当英英词典(附中文解释)',
            '我想让你充当英英词典，对于给出的英文单词，你要给出其中文意思以及英文解释，并且给出一个例句，此外不要有其他反馈，第一个单词是“Hello"'
        ],
        [
            '充当抄袭检查员',
            '我想让你充当剽窃检查员。我会给你写句子，你只会用给定句子的语言在抄袭检查中未被发现的情况下回复，别无其他。不要在回复上写解释。我的第一句话是“为了让计算机像人类一样行动，语音识别系统必须能够处理非语言信息，例如说话者的情绪状态。”'
        ],
        [
            '担任 AI 写作导师',
            '我想让你做一个 AI 写作导师。我将为您提供一名需要帮助改进其写作的学生，您的任务是使用人工智能工具（例如自然语言处理）向学生提供有关如何改进其作文的反馈。您还应该利用您在有效写作技巧方面的修辞知识和经验来建议学生可以更好地以书面形式表达他们的想法和想法的方法。我的第一个请求是“我需要有人帮我修改我的硕士论文”。'
        ],
        [
            '作为 UX/UI 开发人员',
            '我希望你担任 UX/UI 开发人员。我将提供有关应用程序、网站或其他数字产品设计的一些细节，而你的工作就是想出创造性的方法来改善其用户体验。这可能涉及创建原型设计原型、测试不同的设计并提供有关最佳效果的反馈。我的第一个请求是“我需要帮助为我的新移动应用程序设计一个直观的导航系统。”'
        ],
        [
            '作为网络安全专家',
            '我想让你充当网络安全专家。我将提供一些关于如何存储和共享数据的具体信息，而你的工作就是想出保护这些数据免受恶意行为者攻击的策略。这可能包括建议加密方法、创建防火墙或实施将某些活动标记为可疑的策略。我的第一个请求是“我需要帮助为我的公司制定有效的网络安全战略。”'
        ],
        [
            '作为招聘人员',
            '我想让你担任招聘人员。我将提供一些关于职位空缺的信息，而你的工作是制定寻找合格申请人的策略。这可能包括通过社交媒体、社交活动甚至参加招聘会接触潜在候选人，以便为每个职位找到最合适的人选。我的第一个请求是“我需要帮助改进我的简历。”'
        ],
        [
            '担任机器学习工程师',
            '我想让你担任机器学习工程师。我会写一些机器学习的概念，你的工作就是用通俗易懂的术语来解释它们。这可能包括提供构建模型的分步说明、使用视觉效果演示各种技术，或建议在线资源以供进一步研究。我的第一个建议请求是“我有一个没有标签的数据集。我应该使用哪种机器学习算法？”'
        ],
        [
            '充当全栈软件开发人员',
            "我想让你充当软件开发人员。我将提供一些关于 Web 应用程序要求的具体信息，您的工作是提出用于使用 Golang 和 Angular 开发安全应用程序的架构和代码。我的第一个要求是'我想要一个允许用户根据他们的角色注册和保存他们的车辆信息的系统，并且会有管理员，用户和公司角色。我希望系统使用 JWT 来确保安全。"
        ],
        [
            '充当正则表达式生成器',
            '我希望你充当正则表达式生成器。您的角色是生成匹配文本中特定模式的正则表达式。您应该以一种可以轻松复制并粘贴到支持正则表达式的文本编辑器或编程语言中的格式提供正则表达式。不要写正则表达式如何工作的解释或例子；只需提供正则表达式本身。我的第一个提示是生成一个匹配电子邮件地址的正则表达式。'
        ],
        [
            '充当 StackOverflow 帖子',
            '我想让你充当 stackoverflow 的帖子。我会问与编程相关的问题，你会回答应该是什么答案。我希望你只回答给定的答案，并在不够详细的时候写解释。不要写解释。当我需要用英语告诉你一些事情时，我会把文字放在大括号内{like this}。我的第一个问题是“如何将 http.Request 的主体读取到 Golang 中的字符串”'
        ],
        [
            '充当表情符号翻译',
            '我要你把我写的句子翻译成表情符号。我会写句子，你会用表情符号表达它。我只是想让你用表情符号来表达它。除了表情符号，我不希望你回复任何内容。当我需要用英语告诉你一些事情时，我会用 {like this} 这样的大括号括起来。我的第一句话是“你好，请问你的职业是什么？”'
        ],
        [
            '充当图表生成器',
            '我希望您充当 Graphviz DOT 生成器，创建有意义的图表的专家。该图应该至少有 n 个节点（我在我的输入中通过写入 [n] 来指定 n，10 是默认值）并且是给定输入的准确和复杂的表示。每个节点都由一个数字索引以减少输出的大小，不应包含任何样式，并以 layout=neato、overlap=false、node [shape=rectangle] 作为参数。代码应该是有效的、无错误的并且在一行中返回，没有任何解释。提供清晰且有组织的图表，节点之间的关系必须对该输入的专家有意义。我的第一个图表是：“水循环 [8]”。'
        ],
        [
            '充当书面作品的标题生成器',
            '我想让你充当书面作品的标题生成器。我会给你提供一篇文章的主题和关键词，你会生成五个吸引眼球的标题。请保持标题简洁，不超过 20 个字，并确保保持意思。回复将使用主题的语言类型。我的第一个主题是“LearnData，一个建立在 VuePress 上的知识库，里面整合了我所有的笔记和文章，方便我使用和分享。”'
        ]
    ];
    var rootEle = document.createElement('div');
    rootEle.id = 'chatgptHelper';
    rootEle.innerHTML = "<div id=\"chatgptHelperOpen\" class=\"fixed top-1/2 right-1 z-50 p-3 rounded-md transition-colors duration-200 text-white cursor-pointer border border-white/20 bg-gray-900 hover:bg-gray-700 -translate-y-1/2\">\u5FEB<br>\u6377<br>\u6307<br>\u4EE4</div><div id=\"chatgptHelperMain\" class=\"fixed top-0 right-0 bottom-0 z-50 flex flex-col px-3 w-96 text-gray-100 bg-gray-900\" style=\"transform: translateX(100%); transition: transform 0.2s;\"><div class=\"py-4 pl-3\"><a href=\"https://github.com/ZinYY/chatgpt-academic-prompt-helper\" target=\"_blank\">ChatGPT \u5C0F\u52A9\u624B\uFF08\u5FEB\u6377\u6307\u4EE4\uFF09</a></div><ul class=\"flex flex-1 overflow-y-auto py-4 border-y border-white/20 text-sm\" style=\"flex-wrap: wrap\">".concat(SHORTCUTS.map(function (_a) {
        var label = _a[0], value = _a[1];
        return "<li class=\"mr-2 mb-2 py-1 px-3 rounded-md hover:bg-gray-700 cursor-pointer\" data-value=\"".concat(encodeURI(value), "\">").concat(label, "</li>");
    }).join(''), "</ul><div class=\"flex items-center py-4\"><div id=\"chatgptHelperClose\" class=\"py-2 px-3 rounded-md cursor-pointer hover:bg-gray-700\">\u5173\u95ED</div><div class=\"flex-1 pr-3 text-right text-sm\"><a class=\"py-2 px-3 rounded-md hover:bg-gray-700\" href=\"https://gitee.com/Zinyy/pictures/raw/master/pic_receive.jpg\" target=\"_blank\">\u7292\u52B3\u4F5C\u8005</a></div></div></div></div>");
    rootEle.querySelector('ul').addEventListener('click', function (event) {
        var target = event.target;
        if (target.nodeName === 'LI') {
            var value = target.getAttribute('data-value');
            if (value) {
                var textareaEle_1 = document.querySelector('textarea');
                textareaEle_1.value = decodeURI(value) + textareaEle_1.value;
                textareaEle_1.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(function () {
                    textareaEle_1.focus();
                }, 1e3);
            }
        }
        chatgptHelperMain.style.transform = 'translateX(100%)';
    });
    document.body.appendChild(rootEle);
    var chatgptHelperMain = document.querySelector('#chatgptHelperMain');
    document.querySelector('#chatgptHelperOpen').addEventListener('click', function () {
        chatgptHelperMain.style.transform = 'translateX(0)';
    });
    function openChatgptHelper() {
        chatgptHelperMain.style.transform = 'translateX(0)';
    }
    var isOpen = false;
    document.addEventListener('keydown', function(event) {
        if (event.metaKey && event.shiftKey && event.code === 'KeyF') {
            if (!isOpen) {
                openChatgptHelper();
                isOpen = true;
            } else {
                // 执行另一个功能的代码
                chatgptHelperMain.style.transform = 'translateX(100%)';
                isOpen = false;
            }
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyF') {
            if (!isOpen) {
                openChatgptHelper();
                isOpen = true;
            } else {
                // 执行另一个功能的代码
                chatgptHelperMain.style.transform = 'translateX(100%)';
                isOpen = false;
            }
        }
    });
    document.querySelector('#chatgptHelperClose').addEventListener('click', function () {
        chatgptHelperMain.style.transform = 'translateX(100%)';
    });
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Escape') {
            chatgptHelperMain.style.transform = 'translateX(100%)';
        }
    });
})();