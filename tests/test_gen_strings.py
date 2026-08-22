"""Tests for translation string generation helpers."""

from scripts.gen_strings import _platform_option_maps


def test_platform_option_maps_includes_conditional_select_options() -> None:
    """Conditional select options are part of the generated translation set."""
    platform = {
        "options": {0: "none", 30: "30_min"},
        "options_when": [
            {
                "when": {"Selected_program_ID": 21},
                "options": {0: "none", 1: "1", 30: "30"},
            }
        ],
    }

    assert _platform_option_maps("select", platform) == [
        {0: "none", 30: "30_min"},
        {0: "none", 1: "1", 30: "30"},
    ]


def test_platform_option_maps_ignores_conditional_options_for_other_platforms() -> None:
    """Only selects support options_when."""
    platform = {
        "options": {0: "off", 1: "on"},
        "options_when": [{"when": {"mode": 1}, "options": {2: "auto"}}],
    }

    assert _platform_option_maps("sensor", platform) == [{0: "off", 1: "on"}]
