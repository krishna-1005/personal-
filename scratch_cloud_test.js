async function testJSONBinKey() {
  const masterKey = "$2a$10$7R817Jv5yZ2g.3qJz.H6g.x5f9B6aZ7c8d9e0f1g2h3i4j5k6l7m";
  const userEmail = "krishkulkarni1005@gmail.com";

  try {
    const res = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': masterKey,
        'X-Bin-Name': 'user_' + userEmail.replace(/[^a-z0-9]/g, '_')
      },
      body: JSON.stringify({ email: userEmail, tasks: [{ id: '1', title: 'Test Task' }] })
    });
    console.log('JSONBin status:', res.status);
    const data = await res.json();
    console.log('JSONBin result:', data);
  } catch (e) {
    console.error('Error:', e);
  }
}

testJSONBinKey();
