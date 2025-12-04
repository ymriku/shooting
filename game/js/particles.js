export const particles = [];
const particlePool = [];

export function spawnParticles(x, y, color = 'orange', count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    const p = particlePool.length ? Object.assign(particlePool.pop(), {
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 40 + Math.floor(Math.random() * 40), age: 0, color, size: 2 + Math.random() * 3
    }) : { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 40 + Math.floor(Math.random() * 40), age: 0, color, size: 2 + Math.random() * 3 };
    particles.push(p);
  }
}

export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.age++;
    if (p.age >= p.life) {
      const removed = particles.splice(i, 1)[0];
      // recycle
      particlePool.push(removed);
    }
  }
}

export function drawParticles(ctx) {
  for (const p of particles) {
    const alpha = 1 - p.age / p.life;
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.globalAlpha = 1;
  }
}
