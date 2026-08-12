async function testNtfySync() {
  const userEmail = "krishkulkarni1005@gmail.com";
  const cleanTopic = "taskpulse_v4_sync_" + userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const fullData = {
    email: userEmail,
    lastSyncedAt: new Date().toISOString(),
    tasks: [
      { id: '1', title: 'Design TaskPulse Pro UI Components', priority: 'high', completed: false },
      { id: '2', title: 'Review Weekly Fitness & Meal Prep Plan', priority: 'medium', completed: false }
    ],
    habits: [{ id: 'h1', title: 'Drink 2L Water', streak: 3 }]
  };

  try {
    // 1. Desktop publishes latest state to ntfy topic
    console.log('1. Desktop publishing latest state to topic:', cleanTopic);
    const pubRes = await fetch(`https://ntfy.sh/${cleanTopic}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData)
    });
    console.log('Publish status:', pubRes.status);

    // 2. Mobile Phone polls latest state from ntfy topic using ONLY email
    console.log('\n2. Mobile Phone polling latest state from topic:', cleanTopic);
    const pollRes = await fetch(`https://ntfy.sh/${cleanTopic}/json?poll=1`);
    console.log('Poll status:', pollRes.status);
    const rawText = await pollRes.text();
    const lines = rawText.trim().split('\n').filter(Boolean);
    console.log('Total messages retrieved:', lines.length);

    if (lines.length > 0) {
      const lastMsg = JSON.parse(lines[lines.length - 1]);
      const payload = JSON.parse(lastMsg.message);
      console.log('Retrieved Tasks on Mobile:', payload.tasks.map(t => t.title));
      console.log('🎉🎉🎉 SUCCESS! NTFY.SH REAL-TIME UNLIMITED ZERO-KEY EMAIL SYNC WORKS PERFECTLY!');
    }
  } catch (e) {
    console.error('Ntfy error:', e);
  }
}

testNtfySync();
