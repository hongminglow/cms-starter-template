<template>
  <main class="page">
    <section class="hero">
      <div class="hero-content">
        <h1>CMS Starter Dashboard</h1>
        <p>
          A clean Vue + Nest template with a single dashboard view, ready for
          your next feature sprint.
        </p>
        <div class="status" :class="healthClass">
          <span class="dot" />
          <span>API status: {{ healthLabel }}</span>
        </div>
      </div>
      <div class="card" v-if="!isAuthenticated">
        <h2>Sign in</h2>
        <p class="muted">
          Use the default admin account seeded by the backend to explore the
          template.
        </p>
        <form @submit.prevent="handleLogin">
          <label>
            Username or email
            <input
              v-model="form.identifier"
              type="text"
              placeholder="admin or admin@example.com"
              autocomplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
          </label>
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Signing in…" : "Sign in" }}
          </button>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
      </div>
      <div class="card" v-else>
        <h2>Welcome back, {{ user?.username }}!</h2>
        <p class="muted">
          You're authenticated. Start building your experience.
        </p>
        <div class="token-box">
          <h3>Access token</h3>
          <code>{{ tokenSnippet }}</code>
        </div>
        <button class="secondary" @click="handleLogout">Log out</button>
      </div>
    </section>

    <section class="grid">
      <article class="tile" v-for="stat in dashboardStats" :key="stat.title">
        <div class="icon">{{ stat.emoji }}</div>
        <div class="details">
          <h3>{{ stat.title }}</h3>
          <p>{{ stat.description }}</p>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

type UserPayload = {
  id: string;
  username: string;
  email: string | null;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const form = reactive({
  identifier: "",
  password: "",
});

const token = ref<string | null>(localStorage.getItem("access_token"));
const storedUser = localStorage.getItem("current_user");
const user = ref<UserPayload | null>(
  storedUser ? JSON.parse(storedUser) : null,
);
const isSubmitting = ref(false);
const errorMessage = ref("");
const apiHealthy = ref<"unknown" | "up" | "down">("unknown");

const isAuthenticated = computed(() => Boolean(token.value));
const tokenSnippet = computed(() => {
  if (!token.value) return "—";
  return `${token.value.slice(0, 12)}…${token.value.slice(-6)}`;
});

const healthLabel = computed(() => {
  switch (apiHealthy.value) {
    case "up":
      return "Online";
    case "down":
      return "Offline";
    default:
      return "Checking…";
  }
});

const healthClass = computed(() => {
  return {
    up: apiHealthy.value === "up",
    down: apiHealthy.value === "down",
  };
});

const dashboardStats = computed(() => [
  {
    title: "Authentication ready",
    description: "JWT-based login flow wired to the Nest backend.",
    emoji: "🔐",
  },
  {
    title: "Prisma ORM",
    description: "PostgreSQL schema seeded with a default admin account.",
    emoji: "🗄️",
  },
  {
    title: "Docker support",
    description: "One command to launch backend, database, and Redis.",
    emoji: "🐳",
  },
  {
    title: "Vue 3 + Vite",
    description:
      "Clean starter view with router and TypeScript out of the box.",
    emoji: "⚡",
  },
]);

async function handleLogin() {
  if (isSubmitting.value) return;

  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: form.identifier.trim(),
        password: form.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const result = (await response.json()) as {
      accessToken: string;
      user: UserPayload;
    };

    token.value = result.accessToken;
    user.value = result.user;
    localStorage.setItem("access_token", result.accessToken);
    localStorage.setItem("current_user", JSON.stringify(result.user));

    form.identifier = "";
    form.password = "";
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unable to sign in right now.";
  } finally {
    isSubmitting.value = false;
  }
}

function handleLogout() {
  token.value = null;
  user.value = null;
  localStorage.removeItem("access_token");
  localStorage.removeItem("current_user");
}

async function checkHealth() {
  try {
    const response = await fetch(`${apiUrl}/health`);
    apiHealthy.value = response.ok ? "up" : "down";
  } catch {
    apiHealthy.value = "down";
  }
}

onMounted(() => {
  checkHealth();
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 3rem 1.5rem 5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.hero {
  display: grid;
  gap: 2rem;
  align-items: start;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.hero-content h1 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  margin-bottom: 0.75rem;
}

.hero-content p {
  color: #5b6472;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  font-size: 0.9rem;
  background: #f1f5f9;
  color: #475569;
}

.status.up {
  background: #dcfce7;
  color: #166534;
}

.status.down {
  background: #fee2e2;
  color: #991b1b;
}

.status .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card h2 {
  margin: 0;
}

.card form {
  display: grid;
  gap: 1rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #475569;
}

input {
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

button {
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #2563eb, #6366f1);
  color: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

button:not([disabled]):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.25);
}

button.secondary {
  background: #f1f5f9;
  color: #0f172a;
}

.muted {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.error {
  color: #dc2626;
  font-size: 0.9rem;
}

.token-box {
  background: #f8fafc;
  border: 1px dashed rgba(148, 163, 184, 0.6);
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  gap: 0.5rem;
}

.token-box code {
  word-break: break-all;
  font-family:
    "Fira Code", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.tile {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.tile .icon {
  font-size: 1.75rem;
}

.tile h3 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
}

.tile p {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .card {
    padding: 1.5rem;
  }

  .page {
    padding: 2rem 1rem 3rem;
  }
}
</style>
