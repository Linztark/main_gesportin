package net.ausiasmarch.gesportin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.ausiasmarch.gesportin.entity.ClubEntity;

@Repository
public interface ClubRepository extends JpaRepository<ClubEntity, Long> {
}
