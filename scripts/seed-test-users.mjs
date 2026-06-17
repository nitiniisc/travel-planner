process.loadEnvFile(new URL("../.env.admin.local", import.meta.url));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TEST_PASSWORD = "Seed-Test-User-1234!";
const emails = [
  "alice@playwright-tests.com",
  "bob@playwright-tests.com",
  "carol@playwright-tests.com",
];

for (const email of emails) {
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
    }),
  });
  const body = await res.json();

  if (!res.ok) {
    console.log(email, "->", body.msg ?? body.message ?? res.status);
  } else {
    console.log(email, "-> created", body.id);
  }
}
