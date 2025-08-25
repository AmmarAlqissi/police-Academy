import { useState, useMemo } from "react";

// 🔵 رابط شعار الأكاديمية
const ACADEMY_LOGO = "https://www.raed.net/img?id=1410950";

// 🔵 ويب هوك الديسكورد
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1409622930647683235/CtNF-4hK9O0n1UzmFzjSmGXxSnW2tDp3uRwXNtIceX3Ynl7tfP8m-iuS-CcO7XgyW3Zc";

export default function App() {
  const [appId] = useState(() =>
    Math.random().toString(36).slice(2, 10).toUpperCase()
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    discordName: "",
    discordId: "",
    characterName: "",
    realAge: "",
    contribute: "",
    experience: "",
    respectReaction: "",
    uniqueness: "",
    dispatchUse: "",
    protocols: "",
    agrees: false,
  });

  const isValid = useMemo(() => {
    return (
      form.discordName.trim().length >= 3 &&
      /^\d{17,20}$/.test(form.discordId.trim()) &&
      form.characterName.trim().length >= 3 &&
      Number(form.realAge) >= 16 &&
      form.contribute.trim().length > 10 &&
      form.experience.trim().length > 5 &&
      form.respectReaction.trim().length > 10 &&
      form.uniqueness.trim().length > 10 &&
      form.dispatchUse.trim().length > 5 &&
      form.protocols.trim().length > 5 &&
      form.agrees
    );
  }, [form]);

  const payload = useMemo(
    () => ({
      applicationId: appId,
      submittedAt: new Date().toISOString(),
      ...form,
    }),
    [form, appId]
  );

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function postDiscord(hookUrl, body) {
    const content =
      `📋 **طلب تقديم جديد – أكاديمية لوس سانتوس للشرطة**\n` +
      `**رقم الطلب:** ${body.applicationId}\n` +
      `**Discord:** ${body.discordName}\n` +
      `**Discord ID:** ${body.discordId}\n` +
      `**Character Name:** ${body.characterName}\n` +
      `**العمر الحقيقي:** ${body.realAge}\n\n` +
      `**ماذا ستقدم للوزارة؟**\n${body.contribute}\n\n` +
      `**خبرة عسكرية:**\n${body.experience}\n\n` +
      `**التصرف عند إهانة من رتبة أعلى:**\n${body.respectReaction}\n\n` +
      `**ما يميزك عن غيرك:**\n${body.uniqueness}\n\n` +
      `**فائدة الدسباتش:**\n${body.dispatchUse}\n\n` +
      `**أهم ثلاث بروتوكلات عسكرية:**\n${body.protocols}`;

    const res = await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error(`Discord failed: ${res.status}`);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      alert("⚠️ يرجى إكمال جميع الحقول المطلوبة بشكل صحيح قبل الإرسال.");
      return;
    }
    setLoading(true);
    try {
      await postDiscord(DISCORD_WEBHOOK_URL, payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("تعذر إرسال الطلب إلى ديسكورد.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div style={styles.wrap}>
        <div style={styles.card}>
          <h2>✅ تم استلام طلبك بنجاح</h2>
          <p>رقم الطلب: {appId}</p>
          <button onClick={() => location.reload()} style={styles.primaryBtn}>
            إرسال طلب جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src={ACADEMY_LOGO} alt="Police Academy" width="120" />
        </div>

        <h1 style={{ marginTop: 0, textAlign: "center" }}>
          🏛️ أكاديمية لوس سانتوس – نموذج التقديم
        </h1>
        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          رقم الطلب: {appId}
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <Field label="Discord (مثال: Ammar) *">
            <input
              style={styles.input}
              value={form.discordName}
              onChange={(e) => handleChange("discordName", e.target.value)}
            />
          </Field>
          <Field label="Discord ID (مثال: 881117851598065704) *">
            <input
              style={styles.input}
              value={form.discordId}
              onChange={(e) => handleChange("discordId", e.target.value)}
            />
          </Field>
          <Field label="Character Name *">
            <input
              style={styles.input}
              value={form.characterName}
              onChange={(e) => handleChange("characterName", e.target.value)}
            />
          </Field>
          <Field label="Your Age in Reality *">
            <input
              type="number"
              style={styles.input}
              value={form.realAge}
              onChange={(e) => handleChange("realAge", e.target.value)}
            />
          </Field>

          <Field label="ماذا ستقدم للوزارة كضابط و عضو مهم و فعال ؟ *">
            <textarea
              rows={3}
              style={styles.textarea}
              value={form.contribute}
              onChange={(e) => handleChange("contribute", e.target.value)}
            />
          </Field>

          <Field label="هل لديك خبرة عسكرية ؟ اذا نعم أذكرها *">
            <textarea
              rows={3}
              style={styles.textarea}
              value={form.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
            />
          </Field>

          <Field label="لو أتى لك أحد الضباط أو رتبته أعلى منك و قام بإهانتك ماهو التصرف الصحيح ؟ *">
            <textarea
              rows={3}
              style={styles.textarea}
              value={form.respectReaction}
              onChange={(e) => handleChange("respectReaction", e.target.value)}
            />
          </Field>

          <Field label="وش الشيء الي يميزك عن غيرك من المتقدمين ؟ *">
            <textarea
              rows={3}
              style={styles.textarea}
              value={form.uniqueness}
              onChange={(e) => handleChange("uniqueness", e.target.value)}
            />
          </Field>

          <Field label="ماهي فائدة الدسباتش ؟ *">
            <textarea
              rows={2}
              style={styles.textarea}
              value={form.dispatchUse}
              onChange={(e) => handleChange("dispatchUse", e.target.value)}
            />
          </Field>

          <Field label="حسب معرفتك اذكر اهم ثلاث بروتوكلات عسكرية *">
            <textarea
              rows={2}
              style={styles.textarea}
              value={form.protocols}
              onChange={(e) => handleChange("protocols", e.target.value)}
            />
          </Field>

          <div style={styles.agreementBox}>
            <label style={{ display: "flex", gap: 10, alignItems: "start" }}>
              <input
                type="checkbox"
                checked={form.agrees}
                onChange={(e) => handleChange("agrees", e.target.checked)}
              />
              <span>
              أتعهد بالالتزام بالقوانين، وأداء مهامي بكل أمانة

              </span>
            </label>
          </div>

          <div style={styles.row}>
            <span
              style={{
                fontSize: 14,
                color: isValid ? "#10b981" : "#f59e0b",
              }}
            >
              {isValid ? "جاهز للإرسال ✅" : "أكمل الحقول المطلوبة ⚠️"}
            </span>
            <button style={styles.primaryBtn} disabled={!isValid || loading}>
              {loading ? "جاري الإرسال..." : "إرسال الطلب"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

// ✨ ستايلات جديدة
const styles = {
  wrap: {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a", // خلفية داكنة لائقة
    color: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center", // يضع النموذج في منتصف الصفحة
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "#2f2f2f", // لون رمادي داكن
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    padding: 30,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #475569",
    backgroundColor: "#1f1f1f",
    color: "#e5e7eb",
    outline: "none",
  },
  textarea: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #475569",
    backgroundColor: "#1f1f1f",
    color: "#e5e7eb",
    outline: "none",
    resize: "vertical",
  },
  agreementBox: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #3f3f3f",
    backgroundColor: "#242424",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  primaryBtn: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#1d4ed8",
    color: "white",
    cursor: "pointer",
  },
};
