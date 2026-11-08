// Generates Maya's messy newsletter as a Word-compatible .doc file.
// Students open this in real Microsoft Word to do the missions.

const PB = `<br clear="all" style="page-break-before:always" />`;

function body(secret: string[]) {
  const [w1, w2, w3] = secret.map((w) => w.toUpperCase());
  return `
<p style="font-family:'Times New Roman';font-size:12pt;color:#000">maya's school newsletter</p>

<p>Hello everyone! welcome to our   school newsletter.this month we have   lots of news about BANANA week, our class trips and our   new library.</p>
<p>our library has 500 new BANANA s for all students. you can borrow a BANANA every monday and give it back on friday . Please take care of every BANANA!</p>
<p>Our teacher says reading a BANANA every day makes your brain strong . Grade 4 read 120 BANANA s last term!!!</p>
<p style="margin-top:60pt">🔍 Secret word number 1 is hiding here: <b>${w1}</b></p>
<p>Keep reading... there are more secret words on the next pages!</p>
${PB}
<p><b>CLASS TRIP NEWS</b></p>
<p>next week grade 4 will visit the science museum.Please bring your water bottle, a snack and your favourite BANANA to read on the bus .</p>
<p>The museum shop sells a BANANA about space , a BANANA about dinosaurs and a BANANA about robots.</p>
<p>we   will   learn   about   planets ,   stars   and   rockets.</p>
<p style="margin-top:60pt">🔍 Secret word number 2 is hiding here: <b>${w2}</b></p>
${PB}
<p><b>ART CORNER</b></p>
<p>our art club made a giant BANANA full of drawings.Everyone can add a picture to the BANANA in the hallway .</p>
<p>The best artist this month wins a new BANANA from the library!</p>
<p>Thank you for reading our newsletter. See you next month!</p>
<p style="margin-top:60pt">🔍 Secret word number 3 is hiding here: <b>${w3}</b></p>
<p>— Maya, Grade 4 Newsletter Editor</p>
`;
}

export function bananaCount(secret: string[]) {
  return (body(secret).match(/BANANA/g) || []).length;
}

export function downloadNewsletter(secret: string[]) {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Maya's Newsletter</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page { size: 21cm 29.7cm; margin: 2cm; }
body { font-family: Calibri, Arial, sans-serif; font-size: 13pt; }
p { margin: 0 0 10pt 0; }
</style></head><body>${body(secret)}</body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Maya-Newsletter.doc";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
