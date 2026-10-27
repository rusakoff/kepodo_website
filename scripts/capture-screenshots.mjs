/** Captures the real Electron UI with deterministic, illustrative responses.
 * No real provider, account, personal document or profile is used.
 * Run after building ../MarkChat: npm run screenshots
 */
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, writeFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const appRoot = resolve(process.env.KEPODO_APP_DIR || join(root, '../MarkChat'));
const require = createRequire(join(appRoot, 'package.json'));
const { _electron: electron, expect } = require('@playwright/test');
const output = join(root, 'public/assets/screenshots');
const originals = join(root, '.captures');
await mkdir(output, { recursive: true });
await mkdir(originals, { recursive: true });

const copy = {
  en: {
    markdown: '# A calmer way to work\n\nA short field guide to protecting your attention and making room for work that matters.\n\n## Make space for focus\n\nAttention is a limited resource. A quieter calendar gives an idea the time it needs to become useful.\n\n- Choose one meaningful task before opening your inbox.\n- Group meetings into a shared window.\n- Leave space to think between tasks.\n\n## A three-week experiment\n\nAn illustrative team experiment: gradually replace scattered meetings with protected focus time.\n\n| Week | Focus time | Change |\n| --- | --- | --- |\n| Week 1 | 12 hours | Observe the calendar |\n| Week 2 | 18 hours | Group meetings |\n| Week 3 | 24 hours | Protect mornings |\n\nThese sample figures illustrate the approach; they are not research findings.\n\n## Make it a habit\n\nStart with one uninterrupted hour. At the end of the week, reflect on what helped and what got in the way.\n\n> A good routine gives your attention somewhere to return.\n\nKeep the parts that work. Adjust the rest.\n',
    settings:'Settings',close:'Close',open:'Open file',discussion:'Open discussion',create:'Create',newChat:'New chat',history:'Chat history',notes:'Notes',document:'Document',connections:'Connections',skills:'Instructions and skills',general:'General',theme:'Theme',dark:'Dark',light:'Light',
    summaryQuestion:'What are the main ideas in this document?',
    summary:'## More room for meaningful work\n\nThe document proposes a simple shift: **protect your attention before filling your calendar.**\n\n1. **Choose one important task.** Start with intention instead of your inbox. [Make space for focus](kepodo-source:s2)\n2. **Group meetings together.** The sample experiment shows 12 → 18 → 24 hours of focus time. These are illustrative figures. [A three-week experiment](kepodo-source:s3)\n3. **Start small and adjust.** Protect one hour, then review what worked. [Make it a habit](kepodo-source:s4)\n\n**The takeaway:** build a repeatable routine that makes attention easier to protect.',
    visualQuestion:'Show the three-week experiment visually.',visualTitle:'Small changes. More room to focus.',chartTitle:'Protected focus time',weeks:['Week 1','Week 2','Week 3'],hours:'Hours',chartNote:'Illustrative figures from the document, not research findings.',
    understandQuestion:'Why does grouping meetings help? Explain with an example.',
    understand:'## Give an idea room to develop\n\nImagine trying to read a chapter while someone taps your shoulder every ten minutes. You spend part of each break remembering where you were.\n\nScattered meetings can create a similar rhythm. Grouping them leaves a longer uninterrupted block for a demanding task.\n\n### A concrete example\n\nInstead of meetings at 10:00, 12:00 and 15:00, imagine a shared afternoon window. Your morning becomes a space for one important piece of work.\n\n*This is an explanatory example, not a claim from the document.*\n\n**A question to consider:** which task in your week would benefit most from an uninterrupted hour?\n\nSource: [Make space for focus](kepodo-source:s2).',
    proposalQuestion:'Suggest a clearer version of the final section.',proposalTitle:'Make the next step more concrete',after:'## Make it a habit\n\nChoose one task and protect a single hour for it. At the end of the week, note what helped you focus and what interrupted you.\n\nKeep what worked. Adjust one thing for the following week.',
    notesQuestion:'Turn these notes into a short action plan.',notesResponse:'## A practical plan\n\n1. **Choose one task.** Decide what deserves your attention before opening your inbox.\n2. **Make a shared meeting window.** Leave the rest of the day open for focused work.\n3. **Protect one hour.** Start with a small, repeatable block.\n4. **Review the week.** Keep what helped; adjust what got in the way.\n\nThis plan uses only your collected notes.',
    instruction:'Explain clearly and concisely. Keep links to the source. Separate the author’s claims from your examples. Ask one useful follow-up question.',instructionLabel:'kepodo instructions',saveInstructions:'Save instructions',
  },
  ru: {
    markdown:'# Как работать спокойнее\n\nНебольшое руководство о том, как беречь внимание и находить время для действительно важной работы.\n\n## Освободите время для главного\n\nВнимание — ограниченный ресурс. Когда в календаре меньше шума, у идеи появляется время превратиться в результат.\n\n- Выберите одну важную задачу до того, как откроете почту.\n- Соберите встречи в общее временное окно.\n- Оставляйте время подумать между задачами.\n\n## Эксперимент на три недели\n\nУчебный пример: команда постепенно заменяет разрозненные встречи защищённым временем для работы.\n\n| Неделя | Время для фокуса | Изменение |\n| --- | --- | --- |\n| Первая | 12 часов | Изучить календарь |\n| Вторая | 18 часов | Сгруппировать встречи |\n| Третья | 24 часа | Освободить утро |\n\nЧисла в примере иллюстрируют подход и не являются результатом исследования.\n\n## Превратите это в привычку\n\nНачните с одного часа без отвлечений. В конце недели подумайте, что помогало сосредоточиться, а что мешало.\n\n> Хорошая привычка даёт вниманию точку опоры.\n\nСохраните то, что работает. Остальное скорректируйте.\n',
    settings:'Настройки',close:'Закрыть',open:'Открыть файл',discussion:'Открыть обсуждение',create:'Создать',newChat:'Новый чат',history:'История чатов',notes:'Заметки',document:'Документ',connections:'Подключения',skills:'Инструкции и навыки',general:'Основные',theme:'Тема',dark:'Тёмная',light:'Светлая',
    summaryQuestion:'Какие главные идеи в этом документе?',
    summary:'## Больше места для важной работы\n\nДокумент предлагает простой подход: **берегите внимание, прежде чем заполнять календарь.**\n\n1. **Выберите одну важную задачу.** Начните с намерения, а не с почты. [Время для главного](kepodo-source:s2)\n2. **Сгруппируйте встречи.** В учебном примере время для фокуса растёт: 12 → 18 → 24 часа. Это условные числа. [Эксперимент](kepodo-source:s3)\n3. **Начните с малого.** Защитите один час, затем оцените результат. [Привычка](kepodo-source:s4)\n\n**Главная мысль:** создайте повторяемый ритм, в котором проще сохранять внимание.',
    visualQuestion:'Покажи эксперимент на три недели наглядно.',visualTitle:'Небольшие изменения. Больше фокуса.',chartTitle:'Время для сосредоточенной работы',weeks:['Первая','Вторая','Третья'],hours:'Часы',chartNote:'Учебные числа из документа, не результаты исследования.',
    understandQuestion:'Почему полезно группировать встречи? Объясни на примере.',
    understand:'## Дайте мысли время развиться\n\nПредставьте, что вы читаете главу, а кто-то отвлекает вас каждые десять минут. После каждой паузы приходится вспоминать, на чём вы остановились.\n\nРазрозненные встречи могут создавать похожий ритм. Если собрать их вместе, останется длинный отрезок для сложной задачи.\n\n### Конкретный пример\n\nВместо встреч в 10:00, 12:00 и 15:00 представьте общее окно после обеда. Утро остаётся для одной важной работы.\n\n*Это поясняющий пример, а не утверждение из документа.*\n\n**Вопрос для размышления:** какой вашей задаче больше всего помог бы час без отвлечений?\n\nИсточник: [Время для главного](kepodo-source:s2).',
    proposalQuestion:'Предложи более ясную формулировку последнего раздела.',proposalTitle:'Сделать следующий шаг конкретнее',after:'## Превратите это в привычку\n\nВыберите одну задачу и выделите для неё час без отвлечений. В конце недели запишите, что помогало сосредоточиться, а что прерывало работу.\n\nСохраните удачные приёмы. На следующую неделю измените что-то одно.',
    notesQuestion:'Собери из этих заметок короткий план действий.',notesResponse:'## Практический план\n\n1. **Выберите одну задачу.** Решите, чему уделить внимание, до открытия почты.\n2. **Соберите встречи вместе.** Оставьте остальной день для сосредоточенной работы.\n3. **Защитите один час.** Начните с небольшого, повторяемого отрезка.\n4. **Подведите итоги недели.** Сохраните то, что помогало, и измените то, что мешало.\n\nПлан составлен только по собранным заметкам.',
    instruction:'Объясняй ясно и кратко. Сохраняй ссылки на источник. Отделяй утверждения автора от своих примеров. Предлагай один полезный вопрос для продолжения.',instructionLabel:'Инструкции kepodo',saveInstructions:'Сохранить инструкции',
  },
};

for (const locale of ['en','ru']) {
  const c = copy[locale];
  let mode = 'summary';
  const dir = await mkdtemp(join(tmpdir(), `kepodo-website-${locale}-`));
  const docPath = join(dir, locale === 'en' ? 'a-calmer-way-to-work.md' : 'как-работать-спокойнее.md');
  await writeFile(docPath,c.markdown);
  await writeFile(join(dir,'preferences.json'), JSON.stringify({ language:locale,instructions:'',skills:[] }));
  const server = createServer(async(req,res) => {
    let body=''; for await (const chunk of req) body+=chunk;
    const input=JSON.parse(body);
    res.writeHead(200,{'Content-Type':'text/event-stream'});
    const send=(delta,finish=null)=>res.write(`data: ${JSON.stringify({id:'website-demo',object:'chat.completion.chunk',created:1,model:'fixture',choices:[{index:0,delta,finish_reason:finish}]})}\n\n`);
    if(input.messages.at(-1)?.role==='tool') {
      send({role:'assistant',content:locale==='en'?'Based on your document.':'На основе вашего документа.'});
    } else if(mode==='visual'||mode==='proposal') {
      const lang=`root = Card([chart, note])\nchart = BarChart(${JSON.stringify(c.weeks)}, [Series(${JSON.stringify(c.hours)}, [12, 18, 24])], "grouped", "", ${JSON.stringify(c.hours)}, 235)\nnote = TextContent(${JSON.stringify(c.chartNote)})`;
      const args=mode==='visual'?{title:c.visualTitle,lang,sources:['s3']}:{title:c.proposalTitle,sectionId:'s4',after:c.after};
      send({role:'assistant',tool_calls:[{index:0,id:`demo-${mode}`,type:'function',function:{name:mode==='visual'?'present_visual':'propose_change',arguments:JSON.stringify(args)}}]},'tool_calls');
    } else send({role:'assistant',content:mode==='notes'?c.notesResponse:c[mode]});
    send({},'stop');res.end('data: [DONE]\n\n');
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const env={...process.env,KEPODO_TEST:'1',KEPODO_DATA_DIR:dir,KEPODO_TEST_PROVIDER_URL:`http://127.0.0.1:${server.address().port}/v1`};
  delete env.ELECTRON_RUN_AS_NODE;
  let app;
  try {
    app=await electron.launch({args:['.'],cwd:appRoot,env});
    const page=await app.firstWindow();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const button=(name)=>page.getByRole('button',{name,exact:true});
    const tab=(name)=>page.getByRole('tab',{name,exact:true});
    const resize=async(w,h)=>{await app.evaluate(({BrowserWindow},{w,h})=>BrowserWindow.getAllWindows()[0].setContentSize(w,h),{w,h});await expect.poll(()=>page.evaluate(()=>innerWidth)).toBe(w);};
    const shot=async(name,locator)=>{
      if (!process.argv.includes('--force')) {
        try { await access(join(output,`${locale}-${name}.webp`)); return; } catch {}
      }
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(350);
      const png=join(originals,`${locale}-${name}.png`);
      await (locator||page).screenshot({path:png,animations:'disabled'});
      execFileSync('rtk',['proxy','cwebp','-quiet','-q','88',png,'-o',join(output,`${locale}-${name}.webp`)]);
      console.log(`Captured ${locale}/${name}`);
    };
    const fresh=async()=>{await button(c.create).click();await page.getByRole('menuitem',{name:c.newChat,exact:true}).click();await expect(page.locator('[data-slot="aui_assistant-message-root"]')).toHaveCount(0);};
    const ask=async(next,text)=>{
      mode=next;const composer=page.locator('.chat-column textarea');
      await composer.fill(text);
      await expect(button(locale==='en'?'Send message':'Отправить сообщение')).toBeEnabled();
      await button(locale==='en'?'Send message':'Отправить сообщение').click();
      if(next==='visual'||next==='proposal')await expect(page.getByTestId(`artifact-${next}`)).toBeVisible();
      else {
        const endings = locale==='en' ? { summary:'attention easier to protect.', understand:'Source: Make space for focus.', notes:'This plan uses only your collected notes.' } : { summary:'проще сохранять внимание.', understand:'Источник: Время для главного.', notes:'План составлен только по собранным заметкам.' };
        await expect(page.locator('[data-slot="aui_assistant-message-root"]').last()).toContainText(endings[next],{timeout:15000});
      }
      await expect(button(locale==='en'?'Stop response':'Остановить ответ')).toHaveCount(0);
      await page.waitForTimeout(500);
    };
    await expect(button(c.open)).toBeVisible();
    await resize(760,850);await shot('welcome');
    await app.evaluate(({dialog},path)=>{dialog.showOpenDialog=async()=>({canceled:false,filePaths:[path]});},docPath);
    await button(c.open).click();await expect(page.getByTestId('document-sheet')).toBeVisible();
    await shot('reading');
    await button(c.discussion).click();await resize(1360,900);
    await shot('workspace');
    await ask('summary',c.summaryQuestion);await shot('summary');
    await fresh();await ask('visual',c.visualQuestion);await shot('visual');
    await button(c.settings).click();await page.getByRole('combobox',{name:c.theme,exact:true}).click();
    await page.getByRole('option',{name:c.dark,exact:true}).click();await button(c.close).click();await shot('dark');
    await button(c.settings).click();await page.getByRole('combobox',{name:c.theme,exact:true}).click();
    await page.getByRole('option',{name:c.light,exact:true}).click();await button(c.close).click();
    await fresh();await ask('understand',c.understandQuestion);await shot('understand');
    await fresh();await ask('proposal',c.proposalQuestion);await shot('proposal');
    await button(c.history).click();await shot('history');await page.keyboard.press('Escape');
    await fresh();
    for(const selector of ['[data-source-id="s2"] li:nth-child(1)','[data-source-id="s2"] li:nth-child(2)','[data-source-id="s4"] p:first-of-type']){
      await page.locator(selector).first().evaluate(element=>{const r=document.createRange();r.selectNodeContents(element);const s=window.getSelection();s.removeAllRanges();s.addRange(r);element.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));});
      await page.waitForTimeout(250);
    }
    await page.evaluate(()=>getSelection()?.removeAllRanges());
    await tab(c.notes).click();await ask('notes',c.notesQuestion);await shot('notes');
    await tab(c.document).click();
    await button(c.settings).click();await tab(c.connections).click();
    await shot('connections',page.locator('.settings-sheet'));
    await tab(c.skills).click();await page.getByRole('textbox',{name:c.instructionLabel,exact:true}).fill(c.instruction);
    await button(c.saveInstructions).click();await shot('skills',page.locator('.settings-sheet'));
    await page.getByRole('tablist',{name:locale==='en'?'Settings sections':'Разделы настроек',exact:true}).getByRole('tab',{name:c.general,exact:true}).click();await shot('settings',page.locator('.settings-sheet'));
    if(errors.length)throw new Error(errors.join('\n'));
  } finally {
    await app?.close();server.closeAllConnections();await new Promise(r=>server.close(r));
  }
}
await writeFile(join(root,'docs/screenshot-provenance.md'),'# Screenshot provenance\n\nCaptured from the real kepodo Electron renderer using its existing isolated test provider. Documents and responses are authored demonstration content, not a live model evaluation. No personal documents or real provider credentials are used. UI markup and CSS are not modified for screenshots.\n\nRun `npm run screenshots` after building the sibling `../MarkChat` app. Requires its Playwright/Electron dependencies and `cwebp`. Screenshots are encoded as WebP at quality 88. The capture script, sample Markdown, and responses are in `scripts/capture-screenshots.mjs`.\n');
