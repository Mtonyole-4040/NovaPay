// NovaPay Demo (HTML/CSS/JS) - Hackathon Prototype

const STORE_KEY = "novapay_demo_user";

const state = {
  user: null,
  wallets: [
    { id: "w1", name: "M-Pesa", balance: 245000 },
    { id: "w2", name: "Airtel Money", balance: 89000 },
    { id: "w3", name: "CRDB Bank", balance: 530760 }
  ],
  budgets: [
    { id: "b1", name: "Food", amount: 150000, type: "Monthly" },
    { id: "b2", name: "Transport", amount: 60000, type: "Monthly" }
  ],
  goals: [
    { id: "g1", name: "Phone", target: 150000, saved: 30000 },
    { id: "g2", name: "Emergency Fund", target: 500000, saved: 120000 }
  ]
};

const screens = [
  "screen-welcome",
  "screen-auth-choice",
  "screen-terms",
  "screen-register",
  "screen-bio-enroll",
  "screen-bio-login",
  "screen-dashboard"
];

function $(id){ return document.getElementById(id); }

function showScreen(id){
  screens.forEach(sid=>{
    const el = $(sid);
    if(!el) return;
    el.classList.toggle("visible", sid === id);
    el.classList.toggle("hidden", sid !== id);
  });
}

function loadUser(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw) state.user = JSON.parse(raw);
  }catch(e){}
}

function saveUser(){
  if(!state.user) return;
  localStorage.setItem(STORE_KEY, JSON.stringify(state.user));
}

function resetDemo(){
  localStorage.removeItem(STORE_KEY);
  state.user = null;
  // Reset sample data
  state.wallets = [
    { id: "w1", name: "M-Pesa", balance: 245000 },
    { id: "w2", name: "Airtel Money", balance: 89000 },
    { id: "w3", name: "CRDB Bank", balance: 530760 }
  ];
  state.budgets = [
    { id: "b1", name: "Food", amount: 150000, type: "Monthly" },
    { id: "b2", name: "Transport", amount: 60000, type: "Monthly" }
  ];
  state.goals = [
    { id: "g1", name: "Phone", target: 150000, saved: 30000 },
    { id: "g2", name: "Emergency Fund", target: 500000, saved: 120000 }
  ];
}

function fmt(n){
  return Number(n).toLocaleString("en-US");
}

function totalWallet(){
  return state.wallets.reduce((s,w)=>s+w.balance,0);
}
function totalBudgets(){
  return state.budgets.reduce((s,b)=>s+b.amount,0);
}
function totalGoalSaved(){
  return state.goals.reduce((s,g)=>s+g.saved,0);
}
function totalGoalTarget(){
  return state.goals.reduce((s,g)=>s+g.target,0);
}

function simulateScan(btnEl, statusEl, onDone){
  btnEl.classList.add("scanning");
  statusEl.textContent = "Scanning…";
  statusEl.style.color = "#93c5fd";

  setTimeout(()=>{
    btnEl.classList.remove("scanning");
    statusEl.textContent = "Biometric match — access granted.";
    statusEl.style.color = "#22c55e";
    setTimeout(onDone, 650);
  }, 1200);
}

function renderWallets(){
  const list = $("walletList");
  if(!list) return;
  list.innerHTML = "";

  state.wallets.forEach(w=>{
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div>
        <strong>${w.name}</strong>
        <div class="sub">TSh ${fmt(w.balance)}</div>
      </div>
      <button class="btn ghost small-btn" data-remove="${w.id}">Remove</button>
    `;
    list.appendChild(row);
  });

  const tb = $("totalBalance");
  if(tb) tb.textContent = "TSh " + fmt(totalWallet());

  list.querySelectorAll("[data-remove]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-remove");
      state.wallets = state.wallets.filter(w=>w.id !== id);
      renderWallets();
      populateSendFrom();
      updateReports();
    });
  });
}

function renderBudgets(){
  const list = $("budgetList");
  if(!list) return;
  list.innerHTML = "";

  state.budgets.forEach(b=>{
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div>
        <strong>${b.name}</strong>
        <div class="sub">TSh ${fmt(b.amount)} • ${b.type}</div>
      </div>
      <button class="btn ghost small-btn" data-rmb="${b.id}">Remove</button>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll("[data-rmb]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-rmb");
      state.budgets = state.budgets.filter(b=>b.id !== id);
      renderBudgets();
      updateReports();
    });
  });
}

function renderGoals(){
  const list = $("goalList");
  if(!list) return;
  list.innerHTML = "";

  state.goals.forEach(g=>{
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div>
        <strong>${g.name}</strong>
        <div class="sub">TSh ${fmt(g.saved)} / ${fmt(g.target)}</div>
      </div>
      <button class="btn ghost small-btn" data-rmg="${g.id}">Remove</button>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll("[data-rmg]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-rmg");
      state.goals = state.goals.filter(g=>g.id !== id);
      renderGoals();
      updateReports();
    });
  });
}

function updateReports(){
  const rtb = $("reportsTotalBudget");
  const rgp = $("reportsGoalProgress");
  if(rtb) rtb.textContent = "TSh " + fmt(totalBudgets());
  if(rgp) rgp.textContent = `TSh ${fmt(totalGoalSaved())} / ${fmt(totalGoalTarget())}`;

  const i1 = $("insight1");
  const i2 = $("insight2");
  const i3 = $("insight3");

  if(i1) i1.textContent = "Budgets help users control spending across categories without friction.";
  if(i2) i2.textContent = "Biometric-first access reduces shared PIN risk and improves trust.";
  if(i3) i3.textContent = "Unified wallets make transfers and payments faster across networks.";
}

function populateSendFrom(){
  const sel = $("sendFromSelect");
  if(!sel) return;
  sel.innerHTML = "";
  state.wallets.forEach(w=>{
    const opt = document.createElement("option");
    opt.value = w.id;
    opt.textContent = `${w.name} — TSh ${fmt(w.balance)}`;
    sel.appendChild(opt);
  });
}

function setupDashboard(){
  $("userNameTop").textContent = state.user?.name || "User";
  $("idValue").textContent = "NP-" + (state.user?.phone || "0000");
  $("idSub").textContent = (state.user?.email || "Biometric-linked wallet");
  renderWallets();
  renderBudgets();
  renderGoals();
  updateReports();
  populateSendFrom();
}

function hookTabs(){
  const tabButtons = document.querySelectorAll(".tab");
  const panels = {
    wallets: $("tab-wallets"),
    budgets: $("tab-budgets"),
    goals: $("tab-goals"),
    reports: $("tab-reports"),
    scan: $("tab-scan")
  };

  tabButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const t = btn.getAttribute("data-tab");
      tabButtons.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      Object.keys(panels).forEach(k=>{
        panels[k].classList.toggle("hidden", k !== t);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  loadUser();

  // Start screen
  if(state.user) showScreen("screen-auth-choice");
  else showScreen("screen-welcome");

  // Buttons
  $("btnGetStarted").onclick = ()=> showScreen("screen-auth-choice");

  $("btnNewUser").onclick = ()=> showScreen("screen-terms");

  $("btnExistingUser").onclick = ()=>{
    if(!state.user){
      alert("No account found. Create a new account first.");
      return;
    }
    showScreen("screen-bio-login");
  };

  $("btnAcceptTerms").onclick = ()=> showScreen("screen-register");
  $("btnBackToChoice1").onclick = ()=> showScreen("screen-auth-choice");
  $("btnBackToChoice2").onclick = ()=> showScreen("screen-auth-choice");
  $("btnBackToChoice3").onclick = ()=> showScreen("screen-auth-choice");

  $("btnResetDemo").onclick = ()=>{
    resetDemo();
    alert("Demo reset successful.");
    showScreen("screen-welcome");
  };

  $("btnGoBiometricEnroll").onclick = ()=>{
    const name = $("regFullName").value.trim();
    const nida = $("regNida").value.trim();
    const email = $("regEmail").value.trim();
    const phone = $("regPhone").value.trim();

    if(!name || !nida || !email || !phone){
      alert("Please fill all fields.");
      return;
    }

    state.user = { name, nida, email, phone, biometric: true };
    saveUser();
    showScreen("screen-bio-enroll");
  };

  // Biometric enroll/login simulations
  $("enrollFaceBtn").onclick = ()=>{
    simulateScan($("enrollFaceBtn"), $("bioEnrollStatus"), ()=>{
      setupDashboard();
      showScreen("screen-dashboard");
    });
  };

  $("enrollFingerBtn").onclick = ()=>{
    simulateScan($("enrollFingerBtn"), $("bioEnrollStatus"), ()=>{
      setupDashboard();
      showScreen("screen-dashboard");
    });
  };

  $("loginFaceBtn").onclick = ()=>{
    if(!state.user){ alert("No user found."); return; }
    simulateScan($("loginFaceBtn"), $("bioLoginStatus"), ()=>{
      setupDashboard();
      showScreen("screen-dashboard");
    });
  };

  $("loginFingerBtn").onclick = ()=>{
    if(!state.user){ alert("No user found."); return; }
    simulateScan($("loginFingerBtn"), $("bioLoginStatus"), ()=>{
      setupDashboard();
      showScreen("screen-dashboard");
    });
  };

  // Logout
  $("btnLogout").onclick = ()=> showScreen("screen-auth-choice");

  // Add wallet
  $("btnAddWallet").onclick = ()=>{
    const name = $("walletNameInput").value.trim();
    const bal = Number($("walletBalanceInput").value.trim());
    if(!name || isNaN(bal)){
      alert("Enter wallet name and numeric balance.");
      return;
    }
    state.wallets.push({ id:"w"+Date.now(), name, balance: bal });
    $("walletNameInput").value = "";
    $("walletBalanceInput").value = "";
    renderWallets();
    populateSendFrom();
    updateReports();
  };

  // Add budget
  $("btnAddBudget").onclick = ()=>{
    const name = $("budgetNameInput").value.trim();
    const amount = Number($("budgetAmountInput").value.trim());
    const type = $("budgetTypeInput").value.trim();

    if(!name || isNaN(amount) || !type){
      alert("Fill all budget fields correctly.");
      return;
    }

    state.budgets.push({ id:"b"+Date.now(), name, amount, type });
    $("budgetNameInput").value = "";
    $("budgetAmountInput").value = "";
    $("budgetTypeInput").value = "";
    renderBudgets();
    updateReports();
  };

  // Add goal
  $("btnAddGoal").onclick = ()=>{
    const name = $("goalNameInput").value.trim();
    const target = Number($("goalTargetInput").value.trim());

    if(!name || isNaN(target)){
      alert("Enter goal name and numeric target.");
      return;
    }

    state.goals.push({ id:"g"+Date.now(), name, target, saved: 0 });
    $("goalNameInput").value = "";
    $("goalTargetInput").value = "";
    renderGoals();
    updateReports();
  };

  // Send money (simulated)
  $("btnSendNow").onclick = ()=>{
    const fromId = $("sendFromSelect").value;
    const to = $("sendToInput").value.trim();
    const amount = Number($("sendAmountInput").value.trim());
    const status = $("sendStatus");

    if(!fromId || !to || isNaN(amount) || amount<=0){
      alert("Fill send fields correctly.");
      return;
    }

    const w = state.wallets.find(x=>x.id===fromId);
    if(!w){ alert("Wallet not found."); return; }
    if(w.balance < amount){ alert("Insufficient balance."); return; }

    status.textContent = "Confirming biometric…";
    status.style.color = "#93c5fd";

    setTimeout(()=>{
      w.balance -= amount;
      renderWallets();
      populateSendFrom();
      updateReports();
      status.textContent = "Payment sent (simulated).";
      status.style.color = "#22c55e";
    }, 1200);
  };

  hookTabs();
});
