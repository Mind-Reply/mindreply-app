type Bucket={tokens:number;updated:number};
const buckets=new Map<string,Bucket>();
export function rateLimit(key:string,capacity=20,refillMs=60_000){const now=Date.now();const b=buckets.get(key)??{tokens:capacity,updated:now};const refill=((now-b.updated)/refillMs)*capacity;b.tokens=Math.min(capacity,b.tokens+refill);b.updated=now;if(b.tokens<1){buckets.set(key,b);return false;}b.tokens-=1;buckets.set(key,b);return true;}
// Prototype only: memory is per process and resets on deploy/scale-out. Replace with
// Redis/Upstash or another shared atomic store for production multi-instance limits.
