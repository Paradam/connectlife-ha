"""Tests for runtime data-dictionary conditions."""

from custom_components.connectlife.conditions import conditions_match
from custom_components.connectlife.dictionaries import Property, Select


def test_conditions_match_scalar_values():
    status = {"program": 7, "flag": 1}

    assert conditions_match(status, {"program": 7, "flag": 1})
    assert not conditions_match(status, {"program": 8})
    assert not conditions_match(status, {"missing": 1})


def test_conditions_match_allowed_value_lists():
    status = {"program": 8, "flag": 1}

    assert conditions_match(status, {"program": [7, 8, 9], "flag": 1})
    assert not conditions_match(status, {"program": [1, 2]})


def test_property_parses_available_when():
    prop = Property(
        {
            "property": "Gentle_Dry",
            "available_when": {"GentleDry_Flag": 1},
            "switch": {},
        }
    )

    assert prop.available_when == {"GentleDry_Flag": 1}


def test_select_parses_conditional_options():
    select = Select(
        "temperature",
        {
            "options": {0: "cold"},
            "options_when": [
                {
                    "when": {"Selected_program_ID": [7, 8]},
                    "options": {0: "cold", 3: "30", 4: "40"},
                },
                {
                    "when": {"Selected_program_ID": 10},
                    "options": {0: "cold", 3: "30"},
                },
            ],
        },
    )

    assert select.options == {0: "cold"}
    assert select.options_when[0].when == {"Selected_program_ID": [7, 8]}
    assert select.options_when[0].options == {0: "cold", 3: "30", 4: "40"}
    assert select.options_when[1].when == {"Selected_program_ID": 10}

def test_conditions_match_or_groups():
    status = {"program": 56, "dry_mode": 0}

    conditions = [
        {"program": [1, 2, 4, 85]},
        {"program": [7, 8, 56], "dry_mode": [1, 2]},
    ]

    assert not conditions_match(status, conditions)
    assert conditions_match({"program": 56, "dry_mode": 1}, conditions)
    assert conditions_match({"program": 1, "dry_mode": 0}, conditions)


def test_property_parses_available_when_or_groups():
    conditions = [
        {"Selected_program_ID": [1, 2, 4, 85]},
        {"Selected_program_ID": [7, 8, 56], "DryModel": [1, 2]},
    ]
    prop = Property(
        {
            "property": "dry_time",
            "available_when": conditions,
            "select": {"options": {1: "iron"}},
        }
    )

    assert prop.available_when == conditions

