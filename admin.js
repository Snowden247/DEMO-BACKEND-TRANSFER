const wallets = [
  { address: '0xUser1...', assets: ['BTC', 'USDT', 'LTC'] },
  { address: '0xUser2...', assets: ['BTC', 'USDT', 'LTC'] }
];

const toggleState = {};

function loadWallets() {
  const container = document.getElementById('walletList');
  wallets.forEach(wallet => {
    const section = document.createElement('div');
    section.innerHTML = `<strong>${wallet.address}</strong><br/>`;
    wallet.assets.forEach(asset => {
      const toggle = document.createElement('div');
      toggle.className = 'toggle';
      toggle.dataset.address = wallet.address;
      toggle.dataset.asset = asset;
      toggle.style.cssText = 'display:inline-block;width:20px;height:20px;border:1px solid #333;margin:4px;cursor:pointer';
      toggle.onclick = () => {
        toggle.classList.toggle('active');
        toggle.style.background = toggle.classList.contains('active') ? 'green' : '';
        const addr = toggle.dataset.address, asset = toggle.dataset.asset;
        if (!toggleState[addr]) toggleState[addr] = [];
        toggle.classList.contains('active')
          ? toggleState[addr].push(asset)
          : toggleState[addr] = toggleState[addr].filter(a => a !== asset);
      };
      section.append(`${asset}`, toggle, document.createElement('br'));
    });
    container.appendChild(section);
  });
}

document.getElementById('transferBtn').onclick = async () => {
  for (const [addr, assets] of Object.entries(toggleState)) {
    for (const asset of assets) {
      await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAddress: addr, asset })
      });
    }
  }
  alert('Transfers simulated. Refreshing deposit log...');
  fetchDeposits();
};

function fetchDeposits() {
  fetch('/api/deposits')
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('depositTable');
      table.innerHTML = '';
      data.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${d.from}</td><td>${d.asset}</td><td>${new Date(d.time).toLocaleString()}</td>`;
        table.appendChild(tr);
      });
    });
}

loadWallets();
fetchDeposits();
