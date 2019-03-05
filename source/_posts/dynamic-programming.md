---
title: 动态规划：从入门到放弃
date: 2019-02-25 21:57:14
categories: 心得
tags:
  - Dynamic Programming

mathjax: true
---

# 什么是动态规划

动态规划（DP, Dynamic Programming）

一句话总结：**在求解一个复杂问题时，将其分解为若干个简单问题。通过求解简单问题的最优解，来找到目标问题的最优解。**

# 动态规划能做什么

常见问题
- 求解斐波那契数列第 N 项 ([Leetcode 509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/))
- 背包问题
- 阶梯问题 ([Leetcode 70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/))
- 硬币问题 ([Leetcode 322. Coin Change](https://leetcode.com/problems/coin-change/))

# 怎么求解动态规划问题

我们通过一个例子来了解一下DP的基本原理。

首先，我们要找到某个状态的最优解，然后在它的帮助下，找到下一个状态的最优解。

如硬币问题的例子

> *硬币问题：如果我们有面值为1元、3元和5元的硬币若干枚，如何用最少的硬币凑够11元？*

<!-- more -->

首先我们将该问题分解为

1. 如何用最少的硬币凑够0元?
2. 如何用最少的硬币凑够1元?
3. 如何用最少的硬币凑够2元?
4. ...
5. 如何用最少的硬币凑够11元?

## “状态”是什么

“状态”用来描述该问题的子问题的解。

显然，第1个问题第解是0，我们只需要0个硬币就能凑够0元。

**我们用 $d(i)=j$ 来表示凑够 $i$ 元至少需要 $j$ 个硬币**

第1个问题即

$$d(0)=0$$

我们在解决第2个问题时（如何用最少的硬币凑够1元?），我们可以结合第1个问题第最优解，来解出第2个问题。

凑出1元时，我们可选的硬币只有1元硬币，我们只需挑选1个1元硬币，结合第1个问题第最优解即可求出第2个问题，即

$$d(1)=d(1-1)+1=d(0)+1=0+1=1$$

同理，凑出2元时，我们仍然只有1元硬币可用，于是再挑选1个1元硬币，结合第二个问题第最优解来求出第三个问题，即

$$d(2)=d(2-1)+1=d(1)+1=1+1=2$$

凑出3元时，我们多了一种3元硬币可选，于是我们就有2种方案可选：

1. 拿起1元硬币

  如果我们拿起1元硬币，我们的目标就变成了：凑够3-1元需要的最少硬币数量，即
  
  $$d(3)=d(3-1)+1=d(2)+1=2+1=3$$

2. 拿起3元硬币

  如果我们拿起3元硬币，我们的目标就变成：凑够3-3=0元需要的最少硬币数量，即
  
  $$d(3)=d(3-3)+1=d(0)+1=0+1=1$$

所以我们得到

$$d(3)=\min\\{d(3-1)+1, d(3-3)+1\\}$$

----

从上面的演算中，我们抽出两个概念：**状态** 和 **状态转移方程**。

上文中 $d(i)$ 表示凑够 $i$ 元需要的最少硬币数量，我们定义为该问题的“状态”。

我们最终要求解的问题可以用这个状态来表示： $d(3)$ 即凑够3元最少需要多少硬币。

状态转移方程就是

$$d(3)=\min\\{d(3-1)+1, d(3-3)+1\\}$$

它描述了状态之间时如何转移的，我们对它抽象化

$$d(i)=\min\\{d(i-v_j)+1\\}$$

其中 $i-v_j \geq 0$, $v_j$ 表示第 $j$ 个硬币的面值

----

有了状态和状态转移方程，这个问题基本上就解决了

下面是当 i 从 0 到 11 时到解

| $i$ | $j$ | $v_j$ ($\min\\{d(i-v_j)\\}$) |
| --- | --- | ------ |
| 0   | 0   | -                          |
| 1   | 1   | 1 (0)                      |
| 2   | 2   | 1 (1)                      |
| 3   | 1   | 3 (0)                      |
| 4   | 2   | 1 (3)                      |
| 5   | 1   | 5 (0)                      |
| 6   | 2   | 3 (3)                      |
| 7   | 3   | 1 (6)                      |
| 8   | 2   | 3 (5)                      |
| 9   | 3   | 1 (8)                      |
| 10  | 2   | 5 (5)                      |
| 11  | 3   | 1 (10)                     |

可以得到，要凑够11元至少需要3枚硬币

$$ d(11)=d(10)+1=d(5)+1+1=d(0)+1+1+1=3 $$

BB 这么多没用， Show your code !

# 代码实现

> Leetcode 322. Coin Change

## Golang

### main

``` go
// CoinChange: coins 硬币, amount 期望的金额, 返回最少需要的硬币数量，如果不可解返回-1
func CoinChange(coins []int, amount int) int {
  dp := make([]int, amount+1)
  dp[0] = 0

  for i := 1; i <= amount; i++ {
    dp[i] = amount + 1
    for _, coin := range coins {
      if coin <= i && dp[i-coin] != -1 && dp[i-coin]+1 < dp[i] {
        dp[i] = dp[i-coin] + 1
      }
    }
    if dp[i] > amount {
      dp[i] = -1
    }
  }

  return dp[amount]
}
```

### unit test

``` go
import "testing"

func TestCoinCharge(t *testing.T) {
  type args struct {
    coins  []int
    amount int
  }
  tests := []struct {
    name string
    args args
    want int
  }{
    {"[2] => 3", args{[]int{2}, 3}, -1},
    {"[2] => 4", args{[]int{2}, 4}, 2},
    {"[1,2,5] => 11", args{[]int{1, 2, 5}, 11}, 3},
    {"[1,3,5] => 11", args{[]int{1, 3, 5}, 11}, 3},
  }
  for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
      if got := CoinCharge(tt.args.coins, tt.args.amount); got != tt.want {
        t.Errorf("CoinCharge() = %v, want %v", got, tt.want)
      }
    })
  }
}

```

### Leetcode result

    Runtime: 8 ms, faster than 99.26% of Go online submissions for Coin Change.

# 初级 DP 问题

上面的内容完成了，接下来我们来看一个较为复杂的 DP 问题：LIS，我们通过这个问题来找到这个问题的状态和状态转移方程。

> [Leetcode 300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)  
> *LIS: 有一个序列有 N 个数，A[1],A[2],...,A[N]. 求出其最长递增子序列的长度。*

我们将这个问题分解，一个序列有 $i$ 个数 A[1],A[2],...,A[i], 其中 $i \lt N$. 

那么这个问题就变成了一个子问题，然后我们定义 $d(i)$, 表示前 $i$ 个数中以 $A[i]$ 结尾的最长递增子序列的长度。

当 $i\to N$ 时，我们把 $d(1)$ 到 $d(N)$ 都计算出来，我们要找的答案就是这里面最大的一个。

状态找到了，下一步来找状态转移方程。举个例子，我们要求的这 N 个数的序列是：

    5, 3, 4, 8, 6, 7
    
根据上面的状态，我们得到

$d(1)=1$ (5) // 5前面没有比它小的 $d(1)=1$

$d(2)=1$ (3) // 3前面没有比它小的 $d(2)=1$

$d(3)=2$ (3 4) // 4前面有1个比它小的，所以 $d(3)=d(2)+1=2$

$d(4)=3$ (3 4 8) // 8前面比他小的有3个数, 所以 $d(4)=\max\\{d(1), d(2), d(3)\\}+1=3$

$d(5)=3$ (3 4 6) // 6前面比他小的有3个数，所以 $d(5)=\max\\{d(1), d(2), d(3)\\}+1=3$

$d(6)=4$ (3 4 6 7) // 7前面比他小的有4个数，所以 $d(6)=\max\\{d(1), d(2), d(4), d(5)\\}+1=4$

----

根据 $d(i)$ 和 $d(i-1)$ 我们可以得到

$$ d(i)= \max\\{1, d(j)+1\\} (j \lt i, A[j] \lt A[i]) $$

解释一下，要找到 $d(i)$, 我们要先找到所有 $A[j]$ 小于 $A[i]$ 的数，分别是 $1 \to j$，并且，
然后找到他们中最大的那一个 $d(j)$, 加上1, 就得到了我们想要的序列 $1 \to i$ 的LIS长度 $d(i)$ 了。

## Golang 实现

> [Leetcode 300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)  

### main $O(n^2)$

``` go
func lengthOfLIS(nums []int) int {
  dp := make([]int, len(nums))
  maxLen := 0

  for i, num := range nums {
    dp[i] = 1
    for j := 0; j < i; j++ {
      if nums[j] < num && dp[j]+1 > dp[i] {
        dp[i] = dp[j] + 1
      }
    }
    if dp[i] > maxLen {
      maxLen = dp[i]
    }
  }

  return maxLen
}
```

### unit test

``` go
import "testing"

func Test_lengthOfLIS(t *testing.T) {
  type args struct {
    nums []int
  }
  tests := []struct {
    name string
    args args
    want int
  }{
    {"4", args{[]int{10, 9, 2, 5, 3, 7, 101, 18}}, 4},
    {"4", args{[]int{10, 9, 2, 2, 5, 3, 7, 101, 18}}, 4},
    {"6", args{[]int{1, 3, 6, 7, 9, 4, 10, 5, 6}}, 6},
  }
  for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
      if got := lengthOfLIS(tt.args.nums); got != tt.want {
        t.Errorf("lengthOfLIS() = %v, want %v", got, tt.want)
      }
    })
  }
}
```

### Leetcode result

    Runtime: 8 ms, faster than 69.34% of Go online submissions for Longest Increasing Subsequence.
    Memory Usage: 2.3 MB, less than 95.45% of Go online submissions for Longest Increasing Subsequence.

看答案是有更快的算法的（0ms $O(n \log n)$），但并不是使用的动态规划来解决,

# 中级 DP 问题

接下来来看看如何解决二维的 DP 问题。

> 一个平面上有 M*N 个格子，每个格子中都放有一定量的苹果🍎。
  从左上角开始，每一步只能往下或者往右走，每走到一个格子上就把格子里的苹果收集起来，
  这样下去，你最多能收集多少个苹果？

这个问题也是一样的思路，第一步找到问题的“状态”，第二部找到“状态转移方程”。

我们用 $S[i][j]$ 表示我们走到 $(i, j)$ 这个格子时我们最多能拿到多少苹果， $S[i][j]$ 就是我们的“状态”

我们注意到，要到达一个格子，我们只有两种方法：从上面来或从左边来。
那么只要我们找到从上面或者左边来的那一个最多拿到多少苹果，我们就能知道当前格子最多能拿到多少苹果，
这样我们就得到了状态转移方程

$$ S[i][j] = A[i][j] + \max\\{S[i-1][j], S[i][j-1]\\} $$

其中 $i$ 代表行， $j$ 代表列，下标均从 0 开始，$A[i][j]$ 代表 $(i, j)$ 处的苹果数。

----

例如我们以 $\begin{bmatrix} [1&2&3], \\\\ [4&5&6], \\\\ [7&8&9], \end{bmatrix}$ 为例

我们在求 $S[1][1]$ 时，需要先求出 $S[0][1]$ 和 $S[1][]0$，然后比较他们取大，然后加上 $A[1][1]$ 上的数即可，即

$$ S[1][1] = A[1][1] + \max\\{S[1][0], S[0][1]\\} $$

又

$$ S[1][0] = A[1][0] + S[0][0] = 4 + 1 = 5 $$
$$ S[0][1] = A[0][1] + S[0][0] = 2 + 1 = 3 $$

所以

$$ S[1][1] = A[1][1] + S[1][0] = 5 + 5 = 10 $$

## Golang 实现

> Leetcode 64. Minimum Path Sum

该题与示例题目相反，求的时路径上的最小值

### main

``` go
package main

func min(x, y int) int {
  if x > y {
    return y
  }
  return x
}

func minPathSum(grid [][]int) int {
  row := len(grid)
  col := len(grid[0])
  for i := 0; i < row; i++ {
    for j := 0; j < col; j++ {
      if i == 0 && j == 0 {
        continue
      } else if i == 0 {
        grid[i][j] += grid[i][j-1]
      } else if j == 0 {
        grid[i][j] += grid[i-1][j]
      } else {
        grid[i][j] += min(grid[i-1][j], grid[i][j-1])
      }
    }
  }
  return grid[row-1][col-1]
}
```

### unit test

``` go
import "testing"

func Test_minPathSum(t *testing.T) {
  type args struct {
    grid [][]int
  }
  tests := []struct {
    name string
    args args
    want int
  }{
    {"7", args{[][]int{
      {1, 3, 1},
      {1, 5, 1},
      {4, 2, 1},
    }}, 7},
  }
  for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
      if got := minPathSum(tt.args.grid); got != tt.want {
        t.Errorf("minPathSum() = %v, want %v", got, tt.want)
      }
    })
  }
}
```

### Leetcode result

    Runtime: 8 ms, faster than 100.00% of Go online submissions for Minimum Path Sum.
    Memory Usage: 3.9 MB, less than 95.45% of Go online submissions for Minimum Path Sum.

非常高效的算法，时间 $O(m*n)$, 空间 $O(1)$，空间上利用了给定的数组，进行累加。
如果不能修改原数组的话新建一个等长的二维数组即可。

# 参考链接

- [《动态规划：从新手到专家》 - Hawstein](http://www.hawstein.com/posts/dp-novice-to-advanced.html)
