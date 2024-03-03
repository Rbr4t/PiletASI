kaart = {1: [1, 2], 3: [5, 1], 7: [1, 2, 14]}


tee = [4, 1, 2]

graph = {}
for i in kaart.keys():
    for j in range(len(kaart[i])):
        for l in range(j + 1, len(kaart[i])):
            for (a, b) in ((j, l), (l, j)):
                a = kaart[i][a]
                b = kaart[i][b]
                if a in graph:
                    if b in graph[a].keys():
                        graph[a][b].append(i)
                    else:
                        graph[a][b] = [i]
                else:
                    graph[a] = {b: [i]}


def DFS(graph, tee, path=[], current=0):
    answers = []
    if current == len(tee) - 1:
        return [path]
    curr_node = tee[current]
    next_node = tee[current + 1]
    if curr_node not in graph:
        return []
    if next_node not in graph[curr_node]:
        return []
    for i in graph[curr_node][next_node]:
        if i not in path:
            new_path = path.copy()
            new_path.append(i)
            answers.extend(DFS(graph, tee, new_path, current + 1))
    return answers


print(DFS(graph, tee))
