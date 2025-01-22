import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseBaseQueryResult, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";

type LeaderboardEntry = {
  name: string;
  score: number;
}

function AnimatedParticle({ index }: { index: number }) {
  const x = useSpring(0, {
    mass: 1,
    stiffness: 20,
    damping: 10
  });

  const y = useSpring(0, {
    mass: 1,
    stiffness: 20,
    damping: 10
  });

  useEffect(() => {
    function animate() {
      const angle = (index * Math.PI * 2) / 20;
      const radius = 100 + Math.sin(Date.now() / 2000) * 50;
      x.set(Math.cos(angle + Date.now() / 3000) * radius);
      y.set(Math.sin(angle + Date.now() / 3000) * radius);
    }

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [index, x, y]);

  return (
    <motion.div
      style={{ x, y }}
      className="absolute w-2 h-2 rounded-full bg-white/10 blur-sm"
    />
  );
}

function AnimatedScore({ value }: { value: number }) {
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  return (
    <motion.div
      className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
    >
      {display}
    </motion.div>
  );
}

const rankColors = {
  1: 'from-yellow-300 to-amber-500 shadow-yellow-500/50',
  2: 'from-slate-300 to-slate-500 shadow-slate-500/50',
  3: 'from-orange-600 to-orange-800 shadow-orange-900/50',
  default: 'from-purple-900 to-slate-900 shadow-purple-900/50'
};

export default function LeaderboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
        const data = [
            {
                name: "John Doe",
                score: Math.floor(Math.random() * 1000)
            },
            {
                name: "Jane Doe",
                score: Math.floor(Math.random() * 1000)
            }
        ].sort((a, b) => b.score - a.score);

        await new Promise((resolve) => setTimeout(resolve, 100));

        return data;
    },
    refetchInterval: 1000
  }) as UseBaseQueryResult<LeaderboardEntry[]>

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  if (isLoading) return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full border-8 border-purple-500/30 border-t-purple-500 animate-spin"></div>
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse tracking-wider">
          Loading Leaderboard...
        </div>
      </div>
    </div>
  )
  
  if (isError) return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-800 via-slate-900 to-black flex items-center justify-center">
      <div className="text-3xl font-bold text-red-500 animate-pulse">Error loading leaderboard</div>
    </div>
  )

  if(!data) return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black flex items-center justify-center">
      <div className="text-3xl font-bold text-white/50">No data available</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      
      {/* Animated glow orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-300" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-500" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((i) => (
          <AnimatedParticle key={i} index={i} />
        ))}
      </div>
      
      <div className="relative p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-tight animate-gradient bg-300% pb-4"
            >
              Global Rankings
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-purple-300/80 font-medium"
            >
              <span className="text-pink-400">★</span> Compete • Dominate • Conquer <span className="text-pink-400">★</span>
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            {/* Animated glow effect */}
            <motion.div 
              animate={{ 
                opacity: [0.25, 0.35, 0.25],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg blur group-hover:opacity-75"
            />
            
            {/* Content */}
            <div className="relative backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 shadow-2xl">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-lg font-bold text-purple-200 w-20">Rank</TableHead>
                    <TableHead className="text-lg font-bold text-purple-200">Player</TableHead>
                    <TableHead className="text-lg font-bold text-purple-200 text-right pr-6">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {data.map((item, index) => (
                      <motion.tr
                        key={item.name}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }
                        }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group/row border-white/20"
                        whileHover={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <TableCell className="relative w-20">
                          <div className="relative w-14 h-14">
                            <motion.div 
                              layoutId={`rank-${item.name}`}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                              }}
                              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                                rankColors[index + 1 as keyof typeof rankColors] || rankColors.default
                              } flex items-center justify-center font-black text-2xl shadow-lg`}
                              whileHover={{ scale: 1.1 }}
                            >
                              <motion.span layoutId={`rank-text-${item.name}`}>
                                #{index + 1}
                              </motion.span>
                            </motion.div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <motion.div layout className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ 
                                color: "rgba(0, 0, 0, 0)",
                                backgroundImage: "linear-gradient(to right, #60A5FA, #A78BFA)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text"
                              }}
                              className="text-xl font-bold tracking-wide"
                            >
                              {item.name}
                            </motion.div>
                          </motion.div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <AnimatePresence mode="wait">
                            <AnimatedScore value={item.score} />
                          </AnimatePresence>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}