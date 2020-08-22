import React, { useState, useEffect } from "react";
import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);
  useEffect(() => {
    var getRepositoriesData = async () => {
      try {
        const result = await api.get('/repositories');
        setRepositories(result.data)
      } catch(err){
        console.error(`Error getting => ${err}`)  
      }
    }

    getRepositoriesData();
  }, [])

  function setRepositoryLikes({id, likes}) {
    setRepositories(repositories.map(a => {
        if (a.id === id) return {...a, likes }
        return a;
      })
    );
  }

  async function handleLikeRepository(id) {
    try {
      const result = await api.post(`/repositories/${id}/like`, {});
      if (result.status.toString().startsWith('2')){
        const repository = result.data;
        setRepositoryLikes(repository);
      }
    } catch(err){
      console.error(`Error liking => ${err}`)
    }
  }

  function getLikesLabel (likes) {
    if (likes>1) return `${likes} curtidas`
    if (likes==1) return `${likes} curtida`
    else return `Nenhuma curtida`
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        {repositories.map(repository => {
          return <View style={styles.repositoryContainer} key={repository.id}>
            <Text style={styles.repository}>{repository.title}</Text>

            <View style={styles.techsContainer}>
              {repositories.techs && repositories.techs.map((tech, index) => {
                return <Text key={index} style={styles.tech}>
                  {tech}
                </Text>
              })}
            </View>

            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                testID={`repository-likes-${repository.id}`}
              >
                {getLikesLabel(repository.likes)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(repository.id)}
              testID={`like-button-${repository.id}`}
            >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>
          </View>
        })}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
